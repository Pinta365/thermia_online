import * as types from './types/api.ts';
import { requestOptions, Thermia_base } from './Thermia_base.ts';

class Thermia extends Thermia_base {
    constructor(username: string, password: string) {
        super(username, password);
    }

    getCurrentUser(options?: requestOptions): Promise<types.CurrentUser> {
        return this.get('/api/v1/users/current', this.accessToken, options);
    }

    getInstallations(offset?: number, limit?: number, options?: requestOptions): Promise<types.InstallationsInfo[]> {
        if (offset || limit) {
            return this.get('/api/v1/InstallationsInfo', this.accessToken, {
                parameters: { offset: offset?.toString() || '0', limit: limit?.toString() || '10' },
            });
        } else {
            return this.get('/api/v1/InstallationsInfo', this.accessToken, options);
        }
    }

    getInstallationDetail(installationId: number, options?: requestOptions): Promise<types.InstallationDetail> {
        return this.get('/api/v1/installations/' + installationId, this.accessToken, options);
    }

    getInstallationStatus(installationId: number, options?: requestOptions): Promise<types.InstallationStatus> {
        return this.get('/api/v1/installationstatus/' + installationId + '/status', this.accessToken, options);
    }

    getInstallationIsOnline(installationId: number, options?: requestOptions): Promise<boolean> {
        return this.get('/api/v1/installationstatus/' + installationId + '/isonline', this.accessToken, options);
    }

    getInstallationUsers(installationId: number, options?: requestOptions): Promise<types.InstallationUser[]> {
        return this.get('/api/v1/installationUsers/installation/' + installationId, this.accessToken, options);
    }

    getInstallationEventsStatus(installationId: number, options?: requestOptions) {
        return this.get('/api/v1/installation/' + installationId + '/events/status', this.accessToken, options);
    }

    getInstallationEvents(installationId: number, onlyActiveAlarms?: boolean, take?: number) {
        if (onlyActiveAlarms || take) {
            let params = '?';
            if (onlyActiveAlarms) {
                params += 'onlyActiveAlarms=' + onlyActiveAlarms +'&';
            }
            if (take) {
                params += 'take=' + take;
            }
            return this.get('/api/v1/installation/' + installationId + '/events' + params, this.accessToken);
        } else {
            return this.get('/api/v1/installation/' + installationId + '/events', this.accessToken);
        }
    }

    getRegisterGroups(profileId: number, options?: requestOptions): Promise<types.RegisteredGroup[]> {
        return this.get('/api/v1/installationprofiles/' + profileId + '/groups', this.accessToken, options);
    }

    getRegisterGroupData(installationId: number, group: string, options?: requestOptions): Promise<types.Register[]> {
        return this.get(
            '/api/v1/Registers/Installations/' + installationId + '/Groups/' + group,
            this.accessToken,
            options,
        );
    }

    getDataHistoryYearsAvailable(installationId: number, options?: requestOptions): Promise<number[]> {
        return this.get(
            '/api/v1/DataHistory/Download/installation/' + installationId + '/yearsAvailable',
            this.accessToken,
            options,
        );
    }

    getDataHistoryAvailableRegisters(
        installationId: number,
        options?: requestOptions,
        periodStart?: string,
        periodEnd?: string,
    ): Promise<types.DataHistoryAvailableRegister[]> {
        if (periodStart || periodEnd) {
            let params = '?';
            if (periodStart) {
                params += 'periodStart=' + periodStart + '&';
            }
            if (periodEnd) {
                params += 'periodEnd=' + periodEnd;
            }
            //+ '?periodStart=2023-01-21T00:00&periodEnd=2023-01-21T23:59'
            return this.get('/api/v1/DataHistory/installation/' + installationId + params, this.accessToken, options);
        } else {
            return this.get('/api/v1/DataHistory/installation/' + installationId, this.accessToken, options);
        }
    }

    getDataHistoryForRegister(
        installationId: number,
        registerId: number,
        resolution: 'minute' | 'hour' | 'day' | 'month' = 'minute',
        options?: requestOptions,
        periodStart?: string,
        periodEnd?: string,
    ): Promise<types.DataHistoryRegister> {
        if (periodStart || periodEnd) {
            let params = '?';
            if (periodStart) {
                params += 'periodStart=' + periodStart + '&';
            }
            if (periodEnd) {
                params += 'periodEnd=' + periodEnd;
            }
            return this.get(
                '/api/v1/DataHistory/installation/' + installationId + '/register/' + registerId + '/' + resolution +
                    params,
                this.accessToken,
                options,
            );
        } else {
            return this.get(
                '/api/v1/DataHistory/installation/' + installationId + '/register/' + registerId + '/' + resolution,
                this.accessToken,
                options,
            );
        }
    }

    getConnectionHistory(installationId: number, options?: requestOptions) {
        return this.get('/api/v1/connectionHistory/installation/' + installationId, this.accessToken, options); //?periodStart=2023-01-21T00:00:00&periodEnd=2023-01-21T23:59:59
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
