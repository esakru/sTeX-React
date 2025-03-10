import { getSectionInfo } from '@stex-react/utils';
import axios from 'axios';
import { COURSE_ROOTS } from '../get-cards-with-smileys/[courseId]';
export const EXCLUDED_CHAPTERS = ['Preface', 'Administrativa', 'Resources'];

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=3600'
  );

  const { courseId } = req.query;
  const courseRoot = COURSE_ROOTS[courseId];
  if (!courseRoot) {
    res.status(404).json({ error: `Course not found: [${courseId}]` });
    return;
  }
  const { archive, filepath } = getSectionInfo(courseRoot);

  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_MMT_URL}/:sTeX/definienda?archive=${archive}&filepath=${filepath}`
  );
  const cards: { id: string; symbols: string[] }[] = resp.data;

  let count = 0;
  for (const e of cards) count += e.symbols.length;

  return res.status(200).json({ chapter: 'all', count });
}
/*

export function removeBadDefs(defs?: DefInfo[]) {
  if (!defs) return undefined;
  return defs.filter((def) => !def.isBad);
}
  const { courseId } = req.query;
  const courseInfo = DRILLS[courseId];
  if (!courseInfo) {
    res.status(404).json({ error: `Course not found: [${courseId}]` });
    return;
  }
  if ('all' in courseInfo) {
    res.status(200).json([{ chapter: 'all', count: courseInfo['all'].length }]);
    return;
  }
  const chapCounts = Object.entries(courseInfo)
    .filter(([chapter, _]) => !EXCLUDED_CHAPTERS.includes(chapter))
    .map(([chapter, defs]) => {
      return { chapter, count: removeBadDefs(defs).length };
    });

  const totalDefs = chapCounts.reduce((p, c) => p + c.count, 0);
  chapCounts.push({ chapter: 'all', count: totalDefs });

  res.status(200).json(chapCounts);
}
*/
