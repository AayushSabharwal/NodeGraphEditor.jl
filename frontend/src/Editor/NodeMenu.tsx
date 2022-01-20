import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Icon, Input, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "preact/hooks";
import { useDispatch, useSelector } from "react-redux";
import { EnumInput } from "~/src/Editor/EnumInput";
import { NumberInputWrapper } from "~/src/Editor/NumberInputWrapper";
import { idSelector, setSelected } from "~/src/lib/editorSlice";
import { deleteNode, nodeSelector, updateNode } from "../lib/graphSlice";
import { ClampedInput } from "./ClampedInput";
import "./NodeMenu.scss";

export function NodeMenu() {
    const selected = useSelector(idSelector());
    const node = useSelector(nodeSelector(selected));
    const dispatch = useDispatch();

    if (!node) return <Box className="card collapse"></Box>;

    const [params, setParams] = useState<Record<string, any>>({});

    useEffect(() => {
        if (selected === -1) {
            setParams({});
            return;
        }
        axios
            .get<Record<string, any>>(`/getparams/${selected}`)
            .then(r => setParams(r.data))
            .catch(e => console.log(e));
    }, [selected]);

    const updateNodeParams = (id: number, key: string, value: any) => {
        axios
            .post<Record<string, any>>(`/updateparams/${id}/${key}`, { value })
            .then(r => setParams(r.data))
            .catch(e => console.log(e));
    };

    const updateName = (new_name: string) =>
        dispatch(updateNode({ id: selected, key: "name", value: new_name }));

    const deleteButtonClick = () => {
        dispatch(deleteNode(selected));
        dispatch(setSelected(-1));
    };

    const grid_items = [];

    for (const k in params) {
        if (k == "type") continue;

        grid_items.push(
            <div key={`key${k}`} className="gridItem uiText">
                {k}
            </div>
        );
        // numeric
        if (params[k].type === "Num") {
            grid_items.push(
                <NumberInputWrapper
                    key={`val${k}`}
                    integer={params[k].num_type !== "float"}
                    unsigned={params[k].num_type === "unsigned"}
                    value={params[k].value}
                    onChange={v => updateNodeParams(node.node_id, k, v)}
                />
            );
        } else if (params[k].type === "Enum") {
            grid_items.push(
                <EnumInput
                    options={params[k].options}
                    value={params[k].value}
                    onChange={v => updateNodeParams(node.node_id, k, v)}
                />
            );
        } else if (params[k].type === "Clamped") {
            grid_items.push(
                <ClampedInput
                    min={params[k].min}
                    max={params[k].max}
                    value={params[k].value}
                    integer={params[k].num_type !== "float"}
                    unsigned={params[k].num_type === "unsigned"}
                    onChange={v =>
                        updateNodeParams(node.node_id, k, {
                            min: params[k].min,
                            max: params[k].max,
                            value: v,
                        })
                    }
                />
            );
        } else if (params[k].type === "String") {
            grid_items.push(
                <Input
                    value={params[k].value}
                    onChange={v => updateNodeParams(node.node_id, k, v.target.value)}
                />
            );
        } else if (params[k].type === "Bool") {
            grid_items.push(
                <Checkbox
                    isChecked={params[k].value}
                    onChange={() => updateNodeParams(node.node_id, k, !params[k].value)}
                />
            );
        } else console.error("Unimplemented Input Type", params[k]);
    }

    return (
        <Box className="card collapse">
            <Box className="header">
                <Input
                    className="namefield"
                    defaultValue={node.node_name}
                    onChange={e => updateName(e.target.value)}
                />
                <Button background="red.400" onClick={deleteButtonClick}>
                    <Icon children={<DeleteIcon />} color="white" />
                </Button>
            </Box>
            <SimpleGrid templateColumns="2fr 3fr" rowGap="10px" width="100%">
                {grid_items}
            </SimpleGrid>
        </Box>
    );
}
