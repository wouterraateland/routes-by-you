import { formatDistanceToNow } from "date-fns";
import { pointsToFont, pointsToHsl } from "utils/grades";

import Link from "next/link";
import Avatar from "components/ui/Avatar";
import Username from "components/Username";

export default function RepeatThumb({ repeat }) {
  return (
    <div className="flex items-center justify-between space-x-4 p-2 sm:px-4">
      <div className="flex items-start space-x-4">
        {repeat.user.avatar && (
          <Link href={`/user/${repeat.user.id}`}>
            <a className="flex-shrink-0">
              <Avatar
                className="w-10 h-10"
                src={repeat.user.avatar}
                alt={repeat.user.display_name}
              />
            </a>
          </Link>
        )}
        <div
          className="flex flex-col space-y-1 mr-auto justify-center"
          style={{ minHeight: 40 }}
        >
          <p className="leading-4">
            <strong className="inline-block">
              <Link href={`/user/${repeat.user.id}`}>
                <a className="hover:underline">
                  <Username user={repeat.user} />
                </a>
              </Link>
            </strong>{" "}
            <span className="inline-block text-gray-400 text-xs uppercase">
              {formatDistanceToNow(new Date(repeat.created_at))} ago
            </span>
          </p>
          <p className="flex items-center space-x-2 text-gray-500">
            {repeat.attempt === 1 ? (
              <span className="rounded-full bg-yellow-100 text-yellow-900 px-2 py-0.5 font-bold">
                ⚡️ Flash
              </span>
            ) : (
              repeat.grade && <span>{repeat.attempt} attempts</span>
            )}
            {repeat.grade && (
              <span
                className="font-bold text-white rounded-full px-2 text-sm"
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
