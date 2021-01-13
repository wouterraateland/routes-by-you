import { formatDistanceToNow } from "date-fns";
import { pointsToFont, pointsToHsl } from "utils/grades";

import Link from "next/link";
import Eye from "./icons/Eye";

export default function RepeatThumb({ repeat }) {
  return (
    <div className="flex items-center justify-between space-x-4 p-2 sm:px-4">
      <div className="flex items-center space-x-4">
        <Link href={`/user/${repeat.user.id}`}>
          <a>
            <img className="w-10 h-10 rounded-full" src={repeat.user.avatar} />
          </a>
        </Link>
        <div className="space-y-1 mr-auto">
          <div className="flex items-baseline space-x-2">
            <p className="font-bold">
              <Link href={`/user/${repeat.user.id}`}>
                <a className="hover:underline">{repeat.user.display_name}</a>
              </Link>
            </p>
            <span className="text-gray-400 text-xs uppercase">
              {formatDistanceToNow(new Date(repeat.created_at))} ago
            </span>
          </div>
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
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold"
          href={repeat.video}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Eye className="h-4" />
          <span>Video</span>
        </a>
      )}
    </div>
  );
}
