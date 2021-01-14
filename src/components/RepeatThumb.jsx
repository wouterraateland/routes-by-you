import { formatDistanceToNow } from "date-fns";
import { pointsToFont, pointsToHsl } from "utils/grades";

import Link from "next/link";

export default function RepeatThumb({ repeat }) {
  return (
    <div className="flex items-center justify-between space-x-4 p-2 sm:px-4">
      <div className="flex items-start space-x-4">
        {repeat.user.avatar && (
          <Link href={`/user/${repeat.user.id}`}>
            <a className="flex-shrink-0">
              <img
                className="w-10 h-10 rounded-full"
                src={repeat.user.avatar}
              />
            </a>
          </Link>
        )}
        <div className="space-y-1 mr-auto">
          <p className="leading-4">
            <strong className="inline-block">
              <Link href={`/user/${repeat.user.id}`}>
                <a className="hover:underline">{repeat.user.display_name}</a>
              </Link>
            </strong>{" "}
            <span className="inline-block text-gray-400 text-xs uppercase">
              {formatDistanceToNow(new Date(repeat.created_at))} ago
            </span>
          </p>
          <p className="flex space-x-2 text-gray-500">
            {repeat.attempt === 1 ? (
              <span className="rounded-full bg-yellow-100 text-yellow-900 px-2 py-0.5 font-bold">
                ⚡️ Flash
              </span>
            ) : (
              repeat.grade && <span>{repeat.attempt} attempts</span>
            )}
            {repeat.grade && (
              <span
                className="font-bold text-white rounded-full px-2 py-0.5"
                style={{ backgroundColor: pointsToHsl(repeat.grade) }}
              >
                {pointsToFont(repeat.grade)}
              </span>
            )}
          </p>
        </div>
      </div>
      {repeat.video && (
        <a
          className="whitespace-nowrap px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold"
          href={repeat.video}
          target="_blank"
          rel="noopener noreferrer"
        >
          ▶ Video
        </a>
      )}
    </div>
  );
}
