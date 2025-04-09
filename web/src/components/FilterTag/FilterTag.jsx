import "./FilterTag.css"

export const FilterTag = ({ tag, updateTagsState }) => {
    return (
        <div className="filter-tag" style={{listStyleType: "none"}}>
            <button
                className="tag-btn"
                onClick={() => updateTagsState(tag.id, !tag.value)}
                style={{backgroundColor: "#000000", color: "#FFFFFF", opacity: tag.value ? 1 : 0.6}}
            >
                {tag.title}
            </button>
        </div>
    )
}