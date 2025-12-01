import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RoundCompleteScreen } from './RoundCompleteScreen';
import type { RoundCompleteScreenProps } from './RoundCompleteScreen';
import type { Badge } from '../../types';

describe('RoundCompleteScreen', () => {
  const mockBadge: Badge = {
    id: 'first-round',
    name: 'Prva igra',
    description: 'Končaj prvi krog',
    icon: 'star',
    condition: () => true,
  };

  const defaultProps: RoundCompleteScreenProps = {
    roundStats: {
      score: 7,
      maxStreak: 4,
      perfectRound: false,
    },
    roundPoints: 70,
    newBadges: [],
    onPlayAgain: vi.fn(),
    onGoHome: vi.fn(),
    playCelebration: vi.fn(),
    playBadgeSound: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should render with round stats', () => {
    render(<RoundCompleteScreen {...defaultProps} />);

    expect(screen.getByText('Bravo!')).toBeInTheDocument();
    expect(screen.getByText('Dosegla si 7/10')).toBeInTheDocument();
    expect(screen.getByText('Igraj znova')).toBeInTheDocument();
    expect(screen.getByText('Domov')).toBeInTheDocument();
  });

  it('should call playCelebration on mount', () => {
    const playCelebration = vi.fn();
    render(<RoundCompleteScreen {...defaultProps} playCelebration={playCelebration} />);

    expect(playCelebration).toHaveBeenCalled();
  });

  it('should animate points counter', () => {
    render(<RoundCompleteScreen {...defaultProps} roundPoints={100} />);

    // Initially points should be 0 or low
    const pointsElement = screen.getByText(/\+\d+ točk/);
    expect(pointsElement).toBeInTheDocument();

    // Advance timers to complete animation
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // Points should be fully displayed
    expect(screen.getByText('+100 točk')).toBeInTheDocument();
  });

  it('should show perfect round bonus for perfect score', () => {
    render(
      <RoundCompleteScreen
        {...defaultProps}
        roundStats={{ score: 10, maxStreak: 10, perfectRound: true }}
      />
    );

    expect(screen.getByText('+20 bonus za popoln krog!')).toBeInTheDocument();
  });

  it('should not show perfect round bonus for imperfect score', () => {
    render(<RoundCompleteScreen {...defaultProps} />);

    expect(screen.queryByText('+20 bonus za popoln krog!')).not.toBeInTheDocument();
  });

  it('should display crown icon for perfect round', () => {
    render(
      <RoundCompleteScreen
        {...defaultProps}
        roundStats={{ score: 10, maxStreak: 10, perfectRound: true }}
      />
    );

    const crownIcon = screen.getByRole('img', { name: 'crown' });
    expect(crownIcon).toBeInTheDocument();
  });

  it('should display star icon for non-perfect round', () => {
    render(<RoundCompleteScreen {...defaultProps} />);

    const starIcon = screen.getByRole('img', { name: 'star' });
    expect(starIcon).toBeInTheDocument();
  });

  it('should show new badges after delay', () => {
    const playBadgeSound = vi.fn();
    render(
      <RoundCompleteScreen
        {...defaultProps}
        newBadges={[mockBadge]}
        playBadgeSound={playBadgeSound}
      />
    );

    // Badges should not be visible initially
    expect(screen.queryByText('Prva igra')).not.toBeInTheDocument();

    // Advance timers past the delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Badges should now be visible
    expect(screen.getByText('Nova značka!')).toBeInTheDocument();
    expect(screen.getByText('Prva igra')).toBeInTheDocument();
    expect(screen.getByText('Končaj prvi krog')).toBeInTheDocument();
    expect(playBadgeSound).toHaveBeenCalled();
  });

  it('should display multiple badges', () => {
    const badges: Badge[] = [
      {
        id: 'badge1',
        name: 'Značka 1',
        description: 'Opis 1',
        icon: 'star',
        condition: () => true,
      },
      {
        id: 'badge2',
        name: 'Značka 2',
        description: 'Opis 2',
        icon: 'trophy',
        condition: () => true,
      },
    ];

    render(<RoundCompleteScreen {...defaultProps} newBadges={badges} />);

    // Advance timers past the delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Značka 1')).toBeInTheDocument();
    expect(screen.getByText('Značka 2')).toBeInTheDocument();
  });

  it('should not show badges section when no new badges', () => {
    render(<RoundCompleteScreen {...defaultProps} newBadges={[]} />);

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('Nova značka!')).not.toBeInTheDocument();
  });

  it('should call onPlayAgain when play again button is clicked', () => {
    const onPlayAgain = vi.fn();
    render(<RoundCompleteScreen {...defaultProps} onPlayAgain={onPlayAgain} />);

    const playAgainButton = screen.getByText('Igraj znova');
    fireEvent.click(playAgainButton);

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('should call onGoHome when home button is clicked', () => {
    const onGoHome = vi.fn();
    render(<RoundCompleteScreen {...defaultProps} onGoHome={onGoHome} />);

    const homeButton = screen.getByText('Domov');
    fireEvent.click(homeButton);

    expect(onGoHome).toHaveBeenCalledTimes(1);
  });

  it('should display correct message for excellent score (8+)', () => {
    render(
      <RoundCompleteScreen
        {...defaultProps}
        roundStats={{ score: 9, maxStreak: 6, perfectRound: false }}
      />
    );

    expect(screen.getByText('Odlično! Dosegla si 9/10!')).toBeInTheDocument();
  });

  it('should display correct message for good score (5-7)', () => {
    render(
      <RoundCompleteScreen
        {...defaultProps}
        roundStats={{ score: 6, maxStreak: 4, perfectRound: false }}
      />
    );

    expect(screen.getByText('Dobro! Dosegla si 6/10. Še naprej tako!')).toBeInTheDocument();
  });

  it('should display correct message for low score (<5)', () => {
    render(
      <RoundCompleteScreen
        {...defaultProps}
        roundStats={{ score: 3, maxStreak: 2, perfectRound: false }}
      />
    );

    expect(screen.getByText('Dosegla si 3/10. Naslednjič bo še boljše!')).toBeInTheDocument();
  });

  it('should hide confetti after animation duration', () => {
    const { container } = render(<RoundCompleteScreen {...defaultProps} />);

    // Confetti should be visible initially
    const confetti = container.querySelector('.absolute.inset-0.pointer-events-none');
    expect(confetti).toBeInTheDocument();

    // Advance timers past confetti duration
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Confetti should be hidden
    const confettiAfter = container.querySelector('.absolute.inset-0.pointer-events-none');
    expect(confettiAfter).not.toBeInTheDocument();
  });

  it('should cleanup timers on unmount', () => {
    const { unmount } = render(<RoundCompleteScreen {...defaultProps} />);

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});
