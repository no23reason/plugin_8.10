// (C) 2021 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
    IDashboardWidgetProps,
    newDashboardSection,
    newDashboardItem,
    newCustomWidget,
    selectCurrentUser,
    useDashboardSelector,
} from "@gooddata/sdk-ui-dashboard";

import entryPoint from "../dp_tiger_v_810_alpha_entry";

import React from "react";
import { userFullName } from "@gooddata/sdk-model";

/*
 * Component to render 'myCustomWidget'. If you create custom widget instance and also pass extra data,
 * then that data will be available in
 */
function MyCustomWidget(_props: IDashboardWidgetProps): JSX.Element {
    return <div>Hello from custom widget</div>;
}

const Greetings: React.FC = () => {
    // read the currently logged in user information
    const user = useDashboardSelector(selectCurrentUser);
    const user2 = userFullName(user);

     return <div>
         <p>"1. Full name": {user.fullName}</p>
         <p>"2. login ID": {user.login}</p>
         <p>"3. email": {user.email}</p>
         <pre>"4. reference": {JSON.stringify(user.ref, null, 2)}</pre>
         <p>"4. first name": {user.firstName}</p>
         <p>"5. last name": {user.lastName}</p>
         <p>"6. organization": {user.organizationName}</p>
         <p>"7. fullname function": {user2}</p>
         AFTER WEBPACK UPGRADE
     </div>;
}

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    public onPluginLoaded(_ctx: DashboardContext, _parameters?: string): Promise<void> | void {
        /*
         * This will be called when the plugin is loaded in context of some dashboard and before
         * the register() method.
         *
         * If the link between the dashboard and this plugin is parameterized, then all the parameters will
         * be included in the parameters string.
         *
         * The parameters are useful to modify plugin behavior in context of particular dashboard.
         *
         * Note: it is safe to delete this stub if your plugin does not need any specific initialization.
         */
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        handlers: IDashboardEventHandling,
    ): void {
        customize.customWidgets().addCustomWidget("myCustomWidget", MyCustomWidget);
        customize.customWidgets().addCustomWidget("greetingsWidget", Greetings);
        customize.layout().customizeFluidLayout((_layout, customizer) => {
            customizer.addSection(
                0,
                newDashboardSection(
                    "Section Added By Plugin",
                    newDashboardItem(newCustomWidget("myWidget1", "myCustomWidget"), {
                        xl: {
                            // all 12 columns of the grid will be 'allocated' for this this new item
                            gridWidth: 12,
                            // minimum height since the custom widget now has just some one-liner text
                            gridHeight: 1,
                        },
                    }),
                    newDashboardItem(newCustomWidget("myWidget2", "greetingsWidget"), {
                        xl: {
                            gridWidth: 6,
                            gridHeight: 9,
                        },
                    }),
                ),
            );
        });
        handlers.addEventHandler("GDC.DASH/EVT.INITIALIZED", (evt) => {
            // eslint-disable-next-line no-console
            console.log("### Dashboard initialized", evt);
        });
    }

    public onPluginUnload(_ctx: DashboardContext): Promise<void> | void {
        /*
         * This will be called when user navigates away from the dashboard enhanced by the plugin. At this point,
         * your code may do additional teardown and cleanup.
         *
         * Note: it is safe to delete this stub if your plugin does not need to do anything extra during unload.
         */
    }
}
