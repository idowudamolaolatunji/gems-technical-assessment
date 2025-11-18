import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../stores';
import { fetchPosts, selectFilteredPosts, selectPostsError, selectPostsLoading, selectSearchQuery, selectUserFilter } from '../../stores/slices/postsSlice';
import { fetchUsers } from '../../stores/slices/usersSlice';

interface Props {
    handleClearFilters: () => void;
}
export default function PostsErrorComponent({ handleClearFilters }: Props) {

    const dispatch = useDispatch<AppDispatch>();
    const posts = useSelector((state: RootState) => selectFilteredPosts(state));
    const postsLoading = useSelector((state: RootState) => selectPostsLoading(state));
    const postsError = useSelector((state: RootState) => selectPostsError(state));
    const searchQuery = useSelector((state: RootState) => selectSearchQuery(state));
    const userFilter = useSelector((state: RootState) => selectUserFilter(state));
    
    const handleRetry = function() {
        dispatch(fetchPosts());
        dispatch(fetchUsers());
    }

    return (
        <React.Fragment>
            {postsError && (
                <div className="error--container">
                    <p>Error: {postsError}</p>
                    <button onClick={handleRetry} className="btn-retry">
                        Retry
                    </button>
                </div>
            )}
            
            {/* WHEN THERE'S NO DATA, HENCE EMPTY */}
            {!postsLoading && !postsError && posts.length === 0 && (
                <div className="empty--container">
                    <p>No posts found or matched your criteria.</p>
                    {(searchQuery || userFilter) && (
                        <button onClick={handleClearFilters} className="btn-retry">
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </React.Fragment>
    )
}
