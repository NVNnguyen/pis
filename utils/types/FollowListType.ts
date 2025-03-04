export type FollowListType = {
    followers: number,
        userFollowers: 
            {
            userId: number,
            username: string,
            avatar: string,
            followers: number,
            firstName: string,
            lastName: string,
            follow: boolean
            }[],
          
    followingNumbers: number,
    userFollowing: {
            userId: number,
            username: string,
            avatar: string,
            followers: number,
            firstName: string,
            lastName: string,
            follow: boolean
        } []
    }
