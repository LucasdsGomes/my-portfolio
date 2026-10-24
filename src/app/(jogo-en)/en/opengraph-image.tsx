import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '../../og';
import { getContent } from '@/content';

export const alt = getContent('en').meta.ogAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return buildOgImage('en');
}
