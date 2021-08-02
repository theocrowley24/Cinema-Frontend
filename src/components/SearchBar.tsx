import React, {useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Popover,
    TextField,
    Typography
} from "@material-ui/core";
import {Search, TuneOutlined} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {VideoTag, VideoTagMapper} from "../types/videos";
import {getAvailableTags} from "../api";
import {trackPromise} from "react-promise-tracker";

export const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const history = useHistory();
    const [availableTags, setAvailableTags] = useState<VideoTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<VideoTag[]>([]);

    const onSearchSubmit = () => {
        history.push(`/search/${searchQuery || "none"}/${selectedTags.map(t => t.id).join(",")}`)
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            const response = await getAvailableTags();

            const _tags = response.map((d: any) => VideoTagMapper(d));

            if (mounted) {
                setAvailableTags(_tags);
                setSelectedTags(_tags);
            }
        }

        trackPromise(fetchData());

        return () => {
            mounted = false;
        }
    }, []);

    const handleTagOnChange = (tag: VideoTag) => {
        const _selectedTags = [...selectedTags];

        if (_selectedTags.filter(t => t.id === tag.id).length > 0) {
            const index = _selectedTags.findIndex(t => t.id === tag.id);
            _selectedTags.splice(index, 1);
        } else {
            _selectedTags.push(tag);
        }

        setSelectedTags(_selectedTags);
    };

    const applyTagFilter = () => {
        onSearchSubmit();
    }

    return <div style={{width: "60%"}}>
        <TextField
            variant={"standard"}
            placeholder={"Search for a video or channel"}
            fullWidth
            style={{width: "60%"}}
            onChange={e => setSearchQuery(e.target.value)}
            onSubmit={() => console.log("Searching...")}
        />

        <IconButton onClick={onSearchSubmit}>
            <Search/>
        </IconButton>

        <Button onClick={handleClick} startIcon={<TuneOutlined/>}>Filters</Button>

        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <div className={"padding-md"}>
                <Typography variant={"subtitle1"}>
                    Tags
                </Typography>

                <FormGroup>
                    {availableTags.map((tag, i) =>
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    checked={selectedTags.filter(t => t.id === tag.id).length > 0}
                                    onChange={() => handleTagOnChange(tag)}
                                />
                            }
                            label={tag.name}
                        />)
                    }
                </FormGroup>

                <Button disableElevation color={"secondary"} variant={"outlined"}
                        onClick={onSearchSubmit}>Apply</Button>
            </div>
        </Popover>
    </div>
}
