import { writable } from "svelte/store";
import type { MyConnector, PositionsState } from "../types";

export function getPositionsStore() {
    const { subscribe, update, set } = writable<PositionsState>({});

    function setConnectorPosition(connector: MyConnector, position: number[]) {
        if (position.length !== 2) return;

        update(old => {
            let temp = {
                [connector.node]: {
                    input: {},
                    output: {},
                    [connector.type]: { [connector.index]: position },
                },
            };
            if (!(connector.node in old))
                return {
                    ...old,
                    ...temp,
                };
            if (!(connector.type in old[connector.node]))
                return {
                    ...old,
                    [connector.node]: { ...old[connector.node], ...temp[connector.node] },
                };
            return {
                ...old,
                [connector.node]: {
                    ...old[connector.node],
                    [connector.type]: {
                        ...old[connector.type],
                        [connector.index]: position,
                    },
                },
            };
        });
    }

    return {
        subscribe,
        setConnectorPosition,
    };
}

export const connector_positions = getPositionsStore();
