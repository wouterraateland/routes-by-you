import Link from "next/link";
import Avatar from "components/ui/Avatar";

export default function Comment({ comment, thumb }) {
  return (
    <div className="flex space-x-4 items-center">
      {!thumb && (
        <Link href={`/user/${comment.user_id}`}>
          <a>
            <Avatar
              className="w-8 h-8"
              src={comment.user.avatar}
              alt={comment.user.display_name}
            />
          </a>
        </Link>
      )}
      <p>
        <Link href={`/user/${comment.user_id}`}>
          <a className="font-bold hover:underline">
            {comment.user.display_name}
          </a>
        </Link>
        &nbsp;&nbsp;
        <span>{comment.text}</span>
      </p>
    </div>
  );
}
