import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSpeech } from './useSpeech'

/**
 * Tests for useSpeech hook browser compatibility
 * These tests verify the hook correctly detects and uses Web Speech API
 */
describe('useSpeech browser compatibility', () => {
  it('detects speech synthesis support when available', async () => {
    const { result } = renderHook(() => useSpeech())

    await waitFor(() => {
      expect(result.current.supported).toBe(true)
    })
  })

  it('loads voice and marks voiceLoaded true', async () => {
    const { result } = renderHook(() => useSpeech())

    await waitFor(
      () => {
        expect(result.current.voiceLoaded).toBe(true)
      },
      { timeout: 6000 }
    )
  })

  it('calls speechSynthesis.speak when speak function is invoked', async () => {
    // Setup spies on the global speechSynthesis
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak')
    const resumeSpy = vi.spyOn(window.speechSynthesis, 'resume')

    const { result } = renderHook(() => useSpeech())

    await waitFor(() => {
      expect(result.current.supported).toBe(true)
    })

    act(() => {
      result.current.speak('hello')
    })

    expect(resumeSpy).toHaveBeenCalled()
    expect(speakSpy).toHaveBeenCalled()

    speakSpy.mockRestore()
    resumeSpy.mockRestore()
  })

  it('initializes with speaking as false', () => {
    const { result } = renderHook(() => useSpeech())

    expect(result.current.speaking).toBe(false)
  })
})
