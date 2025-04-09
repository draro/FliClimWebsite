'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'next-share';

interface SocialShareProps {
  url: string;
  title: string;
  summary?: string;
}

export function SocialShare({ url, title, summary }: SocialShareProps) {
  return (
    <div className="flex gap-2">
      <FacebookShareButton
        url={url}
        quote={title}
        className="transition-transform hover:scale-110"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={title}
        className="transition-transform hover:scale-110"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton
        url={url}
        title={title}
        summary={summary}
        className="transition-transform hover:scale-110"
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
}