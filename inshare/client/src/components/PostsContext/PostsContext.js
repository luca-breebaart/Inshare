import React, { createContext, useContext, useState } from 'react';

const PostsContext = createContext();

export function PostsProvider({ children }) {
    const [posts, setPosts] = useState([]);

    const updatePosts = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <PostsContext.Provider value={{ posts, updatePosts }}>
            {children}
        </PostsContext.Provider>
    );
}

export function usePosts() {
    return useContext(PostsContext);
}
