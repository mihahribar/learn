import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeScreen } from './HomeScreen';
import type { HomeScreenProps } from './HomeScreen';

describe('HomeScreen', () => {
  const defaultProps: HomeScreenProps = {
    totalPoints: 100,
    badgesCount: 3,
    onStartGame: vi.fn(),
    onNavigate: vi.fn(),
    muted: false,
    onToggleMute: vi.fn(),
    soundSupported: true,
    storageAvailable: true,
    speechSupported: true,
  };

  it('should render the app title and subtitle', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('EnglishGym')).toBeInTheDocument();
    expect(screen.getByText('Zabavni načini učenja angleščine!')).toBeInTheDocument();
  });

  it('should display total points and badges count', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Skupne točke')).toBeInTheDocument();
    expect(screen.getAllByText('Značke').length).toBeGreaterThan(0);
  });

  it('should render all four game mode buttons', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('Poslušaj in črkuj')).toBeInTheDocument();
    expect(screen.getByText('Izberi pravilno')).toBeInTheDocument();
    expect(screen.getByText('Množina')).toBeInTheDocument();
    expect(screen.getByText('Dopolni stavke')).toBeInTheDocument();
  });

  it('should call onStartGame with correct mode when game button is clicked', () => {
    const onStartGame = vi.fn();
    render(<HomeScreen {...defaultProps} onStartGame={onStartGame} />);

    fireEvent.click(screen.getByText('Poslušaj in črkuj'));
    expect(onStartGame).toHaveBeenCalledWith('listen-spell');

    fireEvent.click(screen.getByText('Izberi pravilno'));
    expect(onStartGame).toHaveBeenCalledWith('pick-spelling');

    fireEvent.click(screen.getByText('Množina'));
    expect(onStartGame).toHaveBeenCalledWith('plural-forms');

    fireEvent.click(screen.getByText('Dopolni stavke'));
    expect(onStartGame).toHaveBeenCalledWith('grammar-forms');
  });

  it('should render mute/unmute button when sound is supported', () => {
    render(<HomeScreen {...defaultProps} />);

    const muteButton = screen.getByRole('button', { pressed: false });
    expect(muteButton).toBeInTheDocument();
    expect(muteButton).toHaveAttribute('aria-label', 'Zvok vklopljen');
  });

  it('should not render mute button when sound is not supported', () => {
    render(<HomeScreen {...defaultProps} soundSupported={false} />);

    const muteButtons = screen.queryAllByRole('button', { pressed: false });
    // Should only have game mode buttons and badges button, no mute button
    expect(muteButtons).toHaveLength(0);
  });

  it('should call onToggleMute when mute button is clicked', () => {
    const onToggleMute = vi.fn();
    render(<HomeScreen {...defaultProps} onToggleMute={onToggleMute} />);

    const muteButton = screen.getByRole('button', { pressed: false });
    fireEvent.click(muteButton);

    expect(onToggleMute).toHaveBeenCalledTimes(1);
  });

  it('should show muted state correctly', () => {
    render(<HomeScreen {...defaultProps} muted={true} />);

    const muteButton = screen.getByRole('button', { pressed: true });
    expect(muteButton).toHaveAttribute('aria-label', 'Zvok izklopljen');
  });

  it('should call onNavigate when badges button is clicked', () => {
    const onNavigate = vi.fn();
    render(<HomeScreen {...defaultProps} onNavigate={onNavigate} />);

    // Get the badges button - there are multiple "Značke" texts, so we need to be specific
    const badgesButtons = screen.getAllByText('Značke');
    const badgesButton = badgesButtons.find(
      (el) => el.tagName === 'BUTTON' || el.closest('button')
    );
    expect(badgesButton).toBeDefined();
    fireEvent.click(badgesButton!);
    expect(onNavigate).toHaveBeenCalledWith('badges');
  });

  it('should show storage warning when storage is not available', () => {
    render(<HomeScreen {...defaultProps} storageAvailable={false} />);

    expect(screen.getByText('Napredek se ne bo shranil')).toBeInTheDocument();
  });

  it('should show speech warning when speech is not supported', () => {
    render(<HomeScreen {...defaultProps} speechSupported={false} />);

    expect(screen.getByText('Govor ni podprt v tem brskalniku')).toBeInTheDocument();
  });

  it('should show both warnings when neither storage nor speech is available', () => {
    render(<HomeScreen {...defaultProps} storageAvailable={false} speechSupported={false} />);

    expect(screen.getByText('Napredek se ne bo shranil')).toBeInTheDocument();
    expect(screen.getByText('Govor ni podprt v tem brskalniku')).toBeInTheDocument();
  });

  it('should not show warnings when both storage and speech are available', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.queryByText('Napredek se ne bo shranil')).not.toBeInTheDocument();
    expect(screen.queryByText('Govor ni podprt v tem brskalniku')).not.toBeInTheDocument();
  });

  it('should display zero points when no points earned', () => {
    render(<HomeScreen {...defaultProps} totalPoints={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display zero badges when no badges earned', () => {
    render(<HomeScreen {...defaultProps} badgesCount={0} />);

    const badgeCountElements = screen.getAllByText('0');
    expect(badgeCountElements.length).toBeGreaterThan(0);
  });
});
