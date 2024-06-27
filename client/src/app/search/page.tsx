import PageContainer from "@/components/layouts/PageContainer";
import Posts from "@/features/posts/components/PostsContainer";
import SearchPostHeader from "@/features/posts/components/SearchPostHeader";

const SearchPage = () => {
    return (
        <PageContainer>
            <div className="space-y-6">
                <SearchPostHeader />
                <Posts />
            </div>
        </PageContainer>
    )
}

export default SearchPage;