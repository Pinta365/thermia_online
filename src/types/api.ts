export interface TranslationTable {
    [key: string]: string;
}

interface Address {
    addressLine1: string;
    addressLine2: string;
    zip: string;
    city: string;
    countryCode: string;
}

interface Installation {
    id: number;
    name: string;
    deviceId: number;
    macAddress: string;
    profile: {
        id: number;
        icon: number;
        name: string;
        thermiaName: string;
    };
    status: {
        unreadErrors: number;
        unreadWarnings: number;
        unreadInfo: number;
        activeAlarms: number;
        activeCriticalAlarms: number;
    };
    retailerId: number | unknown;
    isOnline: boolean;
    lastOnline: string;
    retailerAccess: number;
    owner: {
        id: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | unknown;
        email: string;
    };
    location: Address | unknown;
}

export interface InstallationsInfo {
    totalCount: number;
    items: Installation[];
}

export interface InstallationDetail {
    deviceId: number;
    macAddress: string;
    hasUserAccount: boolean;
    isOnline: boolean;
    lastOnline: string;
    createdWhen: string;
    retailerAccess: number;
    ownerId: string;
    id: number;
    name: string;
    address: Address;
    model: string;
    operationManualUrl: string;
    timeZoneId: string;
    retailerId: string;
    hasLinkUnit: boolean;
    installationProfileId: number;
}

export interface InstallationStatus {
    hasIndoorTempSensor: boolean;
    indoorTemperature: number;
    isOutdoorTempSensorFunctioning: boolean;
    outdoorTemperature: number;
    isHotWaterActive: boolean;
    hotWaterTemperature: number;
    heatingEffect: number;
    isHeatingEffectSetByUser: boolean;
    heatingEffectRegisters: unknown[];
    reducedHeatingEffect: unknown;
    reducedHeatingEffectRegisters: unknown[];
    isReducedHeatingEffectSetByUser: unknown;
    programVersion: string;
    dcmVersion: string;
    linkIntegrationStatus: boolean;
    roomFactor: number;
    hotWaterRegistryName: string;
    isGaugeDifferenciated: boolean;
}

export interface RegisteredGroup {
    id: number;
    parentId: unknown;
    name: string;
    visibility: number;
}

export interface CurrentUser {
    id: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    culture: string;
    timeZone: string;
    phoneNumber: unknown;
    hasAcceptedEula: boolean;
    hasSuperAdminAccess: boolean;
    hasGlobalAdminAccess: boolean;
    hasAdminAccess: boolean;
    hasCiamAdminAccess: boolean;
}

export interface InstallationUser {
    firstName: string;
    lastName: string;
    isInvitePending: boolean;
    email: string;
}

export interface InstallationEvent {
    unreadErrors: number;
    unreadWarnings: number;
    unreadInfo: number;
    activeAlarms: number;
    activeCriticalAlarms: number;
}

export interface Register {
    registerId: number;
    registerIndex: number;
    registerName: string;
    registerValue: number;
    stringRegisterValue: unknown;
    timeStamp: string;
    isComputedRegister: false;
    presentation: string;
    isReadOnly: boolean;
    minValue: number;
    maxValue: number;
    valueNames: unknown | unknown[];
    falseText: unknown;
    trueText: unknown;
    step: number;
    precision: unknown;
    unit: string;
    modifier: number;
    disabledByLink: false;
    isInvisible: false;
    canBeShownInGraph: boolean;
    graphRegisterIndex: number;
    canBeShownInHistory: boolean;
    collapsible: false;
    groupId: number;
    groupOrder: number;
    groupName: string;
    groupParentId: unknown;
    groupItemId: number;
    groupItemOrder: number;
}

export interface DataHistoryAvailableRegister {
    groupNames: string[];
    registerName: string;
    registerId: number;
    disabledRegisterValue: number | unknown;
    registerVisibilityCondition: string | unknown;
    exclusiveVisibilityCondition: string | unknown;
    isComputed: boolean;
}

export interface DataHistoryRegister {
    resolution: string;
    groupNames: string[];
    count: number;
    hasMore: boolean;
    data: [
        { at: string; val: number },
    ];
}
