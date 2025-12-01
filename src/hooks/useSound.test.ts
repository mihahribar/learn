import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSound } from './useSound';

describe('useSound', () => {
  // Mock AudioContext
  let mockAudioContext: {
    createOscillator: ReturnType<typeof vi.fn>;
    createGain: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
    currentTime: number;
    state: string;
    destination: object;
  };

  let mockOscillator: {
    type: string;
    frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  };

  let mockGainNode: {
    gain: {
      setValueAtTime: ReturnType<typeof vi.fn>;
      exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
    };
    connect: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockOscillator = {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    mockGainNode = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    mockAudioContext = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      close: vi.fn(),
      resume: vi.fn(),
      currentTime: 0,
      state: 'running',
      destination: {},
    };

    // Mock AudioContext constructor as a class
    globalThis.AudioContext = class {
      createOscillator = mockAudioContext.createOscillator;
      createGain = mockAudioContext.createGain;
      close = mockAudioContext.close;
      resume = mockAudioContext.resume;
      currentTime = mockAudioContext.currentTime;
      state = mockAudioContext.state;
      destination = mockAudioContext.destination;
    } as unknown as typeof AudioContext;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSound());

    expect(result.current.muted).toBe(false);
    expect(result.current.supported).toBe(true);
    expect(typeof result.current.playCorrect).toBe('function');
    expect(typeof result.current.playWrong).toBe('function');
    expect(typeof result.current.playCelebration).toBe('function');
    expect(typeof result.current.playBadge).toBe('function');
    expect(typeof result.current.toggleMute).toBe('function');
  });

  it('should toggle mute state', () => {
    const { result } = renderHook(() => useSound());

    expect(result.current.muted).toBe(false);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.muted).toBe(true);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.muted).toBe(false);
  });

  it('should play correct sound when not muted', () => {
    const { result } = renderHook(() => useSound());

    act(() => {
      result.current.playCorrect();
    });

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockAudioContext.createGain).toHaveBeenCalled();
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(880, expect.any(Number));
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();
  });

  it('should play wrong sound when not muted', () => {
    const { result } = renderHook(() => useSound());

    act(() => {
      result.current.playWrong();
    });

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(220, expect.any(Number));
  });

  it('should not play sounds when muted', () => {
    const { result } = renderHook(() => useSound());

    act(() => {
      result.current.toggleMute();
    });

    act(() => {
      result.current.playCorrect();
    });

    expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
  });

  it('should play celebration with multiple tones', () => {
    const { result } = renderHook(() => useSound());

    act(() => {
      result.current.playCelebration();
    });

    // Celebration plays 4 frequencies
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(4);
    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(4);
  });

  it('should play badge sound with multiple tones', () => {
    const { result } = renderHook(() => useSound());

    act(() => {
      result.current.playBadge();
    });

    // Badge plays 3 frequencies
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(3);
    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(3);
  });

  it('should resume suspended AudioContext', () => {
    mockAudioContext.state = 'suspended';
    const { result } = renderHook(() => useSound());

    act(() => {
      result.current.playCorrect();
    });

    expect(mockAudioContext.resume).toHaveBeenCalled();
  });

  it('should cleanup AudioContext on unmount', () => {
    const { result, unmount } = renderHook(() => useSound());

    act(() => {
      result.current.playCorrect();
    });

    unmount();

    expect(mockAudioContext.close).toHaveBeenCalled();
  });

  it('should handle missing AudioContext gracefully', () => {
    // Remove AudioContext
    delete (globalThis as { AudioContext?: typeof AudioContext }).AudioContext;

    const { result } = renderHook(() => useSound());

    expect(result.current.supported).toBe(false);

    // Should not throw when trying to play sounds
    expect(() => {
      act(() => {
        result.current.playCorrect();
      });
    }).not.toThrow();
  });
});
