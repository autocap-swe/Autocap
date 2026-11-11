import { heroVideoSource } from './hero-video';

describe('heroVideoSource', () => {
  it('serves the optimised copy and poster for a known CMS video', () => {
    expect(heroVideoSource('https://cdn.example/Landing_video_ca4fd1af1d.mp4')).toEqual({
      src: '/video/hero-landing.mp4',
      poster: '/video/hero-landing-poster.jpg',
    });
  });

  it('falls back to the CMS file when an editor uploads a new video', () => {
    expect(heroVideoSource('https://cdn.example/New_video_123.mp4')).toEqual({
      src: 'https://cdn.example/New_video_123.mp4',
    });
  });

  it('returns nothing when the CMS has no video', () => {
    expect(heroVideoSource(undefined)).toEqual({});
  });
});
