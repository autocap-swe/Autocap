/**
 * Web-optimised copies of hero videos uploaded to the CMS, keyed by the CMS file name.
 * A video without an entry here is played straight from the CMS, unoptimised.
 */
const OPTIMISED: Record<string, { src: string; poster: string }> = {
  // "Landing video.mp4": 5.3 MB in the CMS, 0.9 MB re-encoded (H.264, 720p, no audio track).
  'Landing_video_ca4fd1af1d.mp4': {
    src: '/video/hero-landing.mp4',
    poster: '/video/hero-landing-poster.jpg',
  },
};

export interface HeroVideoSource {
  src?: string;
  poster?: string;
}

export function heroVideoSource(cmsUrl: string | undefined): HeroVideoSource {
  if (!cmsUrl) return {};
  const fileName = cmsUrl.split('/').pop() ?? '';
  return OPTIMISED[fileName] ?? { src: cmsUrl };
}
