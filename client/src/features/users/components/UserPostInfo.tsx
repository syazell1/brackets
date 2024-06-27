import { UsersInfo } from "../types/users.types"
import UserAvatar from "./UserAvatar"
import UserHoverCard from "./UserHoverCard"

type UserPostInfoType = {
    usersInfo : UsersInfo,
    createdDate: string
}

const UserPostInfo = ({ usersInfo, createdDate }: UserPostInfoType) => {
    return (
        <div className="flex gap-2 items-center">
            <div>
                <UserAvatar />
            </div>
            <div>
                {/* <p className="font-semibold">{username}</p> */}
                <UserHoverCard usersInfo={usersInfo} />
                <p className="text-xs">{new Date(createdDate).toDateString()}</p>
            </div>
        </div>
    )
}

export default UserPostInfo; 