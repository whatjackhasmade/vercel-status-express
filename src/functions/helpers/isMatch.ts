import { hasOnlySpecial } from "vercel-status";
import { isShorterThan } from "vercel-status";
import { removeJoiningWords } from "vercel-status";

const regexSplit = /(?:,| )+/;

export const isMatch = (array: any[], text: string): boolean => {
  if (!array) return false;
  if (!text) return false;

  const lowerText = text.toLowerCase();

  const match = array.some(item => {
    if (!item) return false;

    const lowerArtists: string = item?.artists?.toLowerCase();
    const lowerLabels: string = item?.labels?.toLowerCase();
    const lowerTitle: string = item?.artists?.toLowerCase();

    let artists: string[] = lowerArtists.split(regexSplit);
    let labels: string[] = lowerLabels.split(regexSplit);
    let title: string[] = lowerTitle.split(regexSplit);

    artists = removeJoiningWords(artists);
    labels = removeJoiningWords(labels);
    title = removeJoiningWords(title);

    labels = labels.filter(l => !hasOnlySpecial(l));
    title = title.filter(t => !hasOnlySpecial(t));

    labels = labels.filter(l => !isShorterThan(l, 4));
    labels = labels.filter(l => l !== "recordings");

    title = title.filter(t => !isShorterThan(t, 4));

    const matchArtists: boolean = artists.some(a => lowerText.includes(a));
    const matchLabels: boolean = labels.some(l => lowerText.includes(l));
    const matchTitle: boolean = title.some(t => lowerText.includes(t));
    const matchWishlist: boolean = matchArtists;

    return matchWishlist;
  });

  return match;
};
