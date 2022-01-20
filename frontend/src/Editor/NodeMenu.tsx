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

type NumberType = "integer" | "float" | "unsigned";

type NumberParam = {
    type: "Num";
    num_type: NumberType;
    value: number;
};

type EnumParam = {
    type: "Enum";
    options: string[];
    value: number;
};

type ClampedParam = {
    type: "Clamped";
    num_type: NumberType;
    min: number;
    max: number;
    value: number;
};

type StringParam = {
    type: "String";
    value: string;
};

type BoolParam = {
    type: "Bool";
    value: boolean;
};

type Param = NumberParam | EnumParam | ClampedParam | StringParam | BoolParam;

export function NodeMenu() {
    const selected = useSelector(idSelector());
    const node = useSelector(nodeSelector(selected));
    const dispatch = useDispatch();

    if (!node) return <Box className="card collapse"></Box>;

    const [params, setParams] = useState<Record<string, Param>>({});

    useEffect(() => {
        if (selected === -1) {
            setParams({});
            return;
        }
        axios
            .get<Record<string, Param>>(`/getparams/${selected}`)
            .then(r => setParams(r.data))
            .catch(e => console.log(e));
    }, [selected]);

    const updateNodeParams = (id: number, key: string, value: unknown) => {
        axios
            .post<Record<string, Param>>(`/updateparams/${id}/${key}`, { value })
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

        const param = params[k];
        // numeric
        if (param.type === "Num") {
            grid_items.push(
                <NumberInputWrapper
                    key={`val${k}`}
                    integer={param.num_type !== "float"}
                    unsigned={param.num_type === "unsigned"}
                    value={param.value}
                    onChange={v => updateNodeParams(node.node_id, k, v)}
                />
            );
        } else if (param.type === "Enum") {
            grid_items.push(
                <EnumInput
                    options={param.options}
                    value={param.value}
                    onChange={v => updateNodeParams(node.node_id, k, v)}
                />
            );
        } else if (param.type === "Clamped") {
            grid_items.push(
                <ClampedInput
                    min={param.min}
                    max={param.max}
                    value={param.value}
                    integer={param.num_type !== "float"}
                    unsigned={param.num_type === "unsigned"}
                    onChange={v =>
                        updateNodeParams(node.node_id, k, {
                            min: param.min,
                            max: param.max,
                            value: v,
                        })
                    }
                />
            );
        } else if (param.type === "String") {
            grid_items.push(
                <Input
                    value={param.value}
                    onChange={v => updateNodeParams(node.node_id, k, v.target.value)}
                />
            );
        } else if (param.type === "Bool") {
            grid_items.push(
                <Checkbox
                    isChecked={param.value}
                    onChange={() => updateNodeParams(node.node_id, k, !param.value)}
                />
            );
        } else console.error("Unimplemented Input Type", param);
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
