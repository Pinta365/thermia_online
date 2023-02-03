import * as types from './types/api.ts';
import { Thermia_base } from './Thermia_base.ts';

class Thermia extends Thermia_base {
    constructor(username: string, password: string) {
        super(username, password);
    }

    getCurrentUser(): Promise<types.CurrentUser> {
        return this.get('/api/v1/users/current', this.accessToken);
    }

    getInstallations(offset?: number, limit?: number): Promise<types.InstallationsInfo[]> {
        const params = { offset: offset?.toString() || '0', limit: limit?.toString() || '10' };
        return this.get('/api/v1/InstallationsInfo', this.accessToken, {
            parameters: params,
        });
    }

    getInstallationDetail(installationId: number): Promise<types.InstallationDetail> {
        return this.get('/api/v1/installations/' + installationId, this.accessToken);
    }

    getInstallationStatus(installationId: number): Promise<types.InstallationStatus> {
        return this.get('/api/v1/installationstatus/' + installationId + '/status', this.accessToken);
    }

    getInstallationIsOnline(installationId: number): Promise<boolean> {
        return this.get('/api/v1/installationstatus/' + installationId + '/isonline', this.accessToken);
    }

    getInstallationUsers(installationId: number): Promise<types.InstallationUser[]> {
        return this.get('/api/v1/installationUsers/installation/' + installationId, this.accessToken);
    }

    getInstallationEventsStatus(installationId: number) {
        return this.get('/api/v1/installation/' + installationId + '/events/status', this.accessToken);
    }

    getInstallationEvents(installationId: number, onlyActiveAlarms?: boolean, take?: number) {
        const params = {
            onlyActiveAlarms: (onlyActiveAlarms ? String(onlyActiveAlarms) : ''),
            take: take?.toString() || '',
        };
        return this.get('/api/v1/installation/' + installationId + '/events', this.accessToken, {
            parameters: params,
        });
    }

    getRegisterGroups(profileId: number): Promise<types.RegisteredGroup[]> {
        return this.get('/api/v1/installationprofiles/' + profileId + '/groups', this.accessToken);
    }

    getRegisterGroupData(installationId: number, group: string): Promise<types.Register[]> {
        return this.get(
            '/api/v1/Registers/Installations/' + installationId + '/Groups/' + group,
            this.accessToken,
        );
    }

    getDataHistoryYearsAvailable(installationId: number): Promise<number[]> {
        return this.get(
            '/api/v1/DataHistory/Download/installation/' + installationId + '/yearsAvailable',
            this.accessToken,
        );
    }

    getDataHistoryAvailableRegisters(
        installationId: number,
        periodStart: string,
        periodEnd: string,
    ): Promise<types.DataHistoryAvailableRegister[]> {
        const params = { periodStart, periodEnd };
        return this.get('/api/v1/DataHistory/installation/' + installationId, this.accessToken, {
            parameters: params,
        });
    }

    getDataHistoryForRegister(
        installationId: number,
        registerId: number,
        resolution: 'minute' | 'hour' | 'day' | 'month' = 'minute',
        periodStart: string,
        periodEnd: string,
    ): Promise<types.DataHistoryRegister> {
        const params = { periodStart, periodEnd };
        return this.get(
            '/api/v1/DataHistory/installation/' + installationId + '/register/' + registerId + '/' + resolution,
            this.accessToken,
            { parameters: params },
        );
    }

    getConnectionHistory(installationId: number) {
        return this.get('/api/v1/connectionHistory/installation/' + installationId, this.accessToken); //?periodStart=2023-01-21T00:00:00&periodEnd=2023-01-21T23:59:59
    }

    async getHeatingEffect(installationId: number) {
        const status = await this.getInstallationStatus(installationId);
        return status.heatingEffect;
    }

    async getHeatingEffectRegister(installationId: number) {
        const status = await this.getInstallationStatus(installationId);
        return status.heatingEffectRegisters;
    }

    async setHeatingEffect(installationId: number, value: number) {
        const heaters = await this.getHeatingEffectRegister(installationId);
        const heater = heaters.find((item) => item !== null) as number;

        if (heater) {
            const oldValue = (await this.getInstallationStatus(installationId)).heatingEffect;
            await this.setRegisterValue(installationId, heater, value);
            const newValue = (await this.getInstallationStatus(installationId)).heatingEffect;

            if (newValue === value) {
                return { status: 'ok', oldValue: oldValue, newValue: newValue };
            } else {
                throw new Error(`Error setting the new target value '${value}'.`);
            }
        } else {
            throw new Error(`Error getting effect register on the installation  '${installationId}'.`);
        }
    }

    setRegisterValue(installationId: number, registerIndex: number, registervalue: number | string) {
        const body = {
            clientUuid: '8581d76b-1fbf-4857-8b80-757fa27140f6',
            registerIndex: registerIndex,
            registervalue: registervalue,
        };
        return this.post('/api/v1/Registers/Installations/' + installationId + '/Registers', this.accessToken, body);
    }
}

export default Thermia;
