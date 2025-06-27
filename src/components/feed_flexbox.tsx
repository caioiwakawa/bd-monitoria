import { Children, ReactNode } from "react";

function FeedFlexBox(props: {children: ReactNode}) {
    return (
        <div className="relative flex flex-wrap flex-1/4 mx-auto mb-25 w-300 h-auto rounded-4xl bg-white">
            {props.children}
        </div>
    )
}

export default FeedFlexBox;