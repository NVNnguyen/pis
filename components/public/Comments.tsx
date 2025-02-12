import { View } from "react-native";
import PostItem from "./PostItems";

const Comments = () => {    
    return (
        <View>
           <PostItem 
               user="John Doe" 
               caption="This is a caption" 
               images={[]} 
               likes={0} 
               comments={[]} 
               createdAt={new Date()} 
           />

        </View>
    )
}

export default Comments;