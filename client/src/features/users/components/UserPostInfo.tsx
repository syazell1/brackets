import UserAvatar from "./UserAvatar"

type UserPostInfoType = {
    username: string,
    createdDate: string
}

const UserPostInfo = ({ username, createdDate }: UserPostInfoType) => {
    return (
        <div className="flex gap-2 items-center">
            <div>
                <UserAvatar />
            </div>
            <div>
                <p className="font-semibold">{username}</p>
                <p className="text-xs">{new Date(createdDate).toDateString()}</p>
            </div>
        </div>
    )
}

export default UserPostInfo; 