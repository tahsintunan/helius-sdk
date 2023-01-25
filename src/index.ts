import axios, { AxiosError } from "axios";
import { Webhook, CreateWebhookRequest, EditWebhookRequest } from "./types";

const API_URL_V0: string = "https://api.helius.xyz/v0";
const API_URL_V1: string = "https://api.heliuys.xyz/v1";

export * as Types from './types';

/** 
 * This is the base level class for interfacing with all Helius API methods.
 * @class
 */
export class Helius {

    /**
     * API key generated at dev.helius.xyz
     * @private
     */
    private apiKey: string;

    /**
     * Initializes Helius API client with an API key 
     * @constructor
     * @param apiKey - API key generated at dev.helius.xyz
     */
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
    * Retrieves a list of all webhooks associated with the current API key
    * @returns {Promise<Webhook[]>} a promise that resolves to an array of webhook objects
    * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
    */
    async getAllWebhooks(): Promise<Webhook[]> {
        try {
            const { data } = await axios.get(
                `${API_URL_V0}/webhooks?api-key=${this.apiKey}`
            );
            return data;
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                throw new Error(`error calling getWebhooks: ${err.response?.data.error}`)
            } else {
                throw new Error(`error calling getWebhooks: ${err}`)
            }
        }
    }

    /**
    * Retrieves a single webhook by its ID, associated with the current API key
    * @param {string} webhookID - the ID of the webhook to retrieve
    * @returns {Promise<Webhook>} a promise that resolves to a webhook object
    * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
    */
    async getWebhookByID(webhookID: string): Promise<Webhook> {
        try {
            const { data } = await axios.get(`${API_URL_V0}/webhooks/${webhookID}?api-key=${this.apiKey}`)
            return data
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                throw new Error(`error during getWebhookByID: ${err.response?.data.error}`)
            } else {
                throw new Error(`error during getWebhookByID: ${err}`)
            }
        }
    }


    /**
    * Creates a new webhook with the provided request
    * @param {CreateWebhookRequest} createWebhookRequest - the request object containing the webhook information
    * @returns {Promise<Webhook>} a promise that resolves to the created webhook object
    * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
    */
    async createWebhook(createWebhookRequest: CreateWebhookRequest): Promise<Webhook> {
        try {
            const { data } = await axios.post(`${API_URL_V0}/webhooks?api-key=${this.apiKey}`, { ...createWebhookRequest })
            return data;
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                throw new Error(`error during createWebhook: ${err.response?.data.error}`)
            } else {
                throw new Error(`error during createWebhook: ${err}`)
            }
        }
    }

    /**
    * Deletes a webhook by its ID
    * @param {string} webhookID - the ID of the webhook to delete
    * @returns {Promise<boolean>} a promise that resolves to true if the webhook was successfully deleted, or false otherwise
    * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
    */
    async deleteWebhook(webhookID: string): Promise<boolean> {
        try {
            await axios.delete(`${API_URL_V0}/webhooks/${webhookID}?api-key=${this.apiKey}`)
            return true
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                throw new Error(`error during deleteWebhook: ${err.response?.data.error}`)
            } else {
                throw new Error(`error during deleteWebhook: ${err}`)
            }
        }
    }

    /**
    * Edits an existing webhook by its ID with the provided request
    * @param {string} webhookID - the ID of the webhook to edit
    * @param {EditWebhookRequest} editWebhookRequest - the request object containing the webhook information
    * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
    * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
    */
    async editWebhook(webhookID: string, editWebhookRequest: EditWebhookRequest): Promise<Webhook> {
        try {
            const webhook = await this.getWebhookByID(webhookID);
            const { data } = await axios.put(`${API_URL_V0}/webhooks/${webhookID}?api-key=${this.apiKey}`, { ...webhook, ...editWebhookRequest })
            return data;
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                throw new Error(`error during editWebhook: ${err.response?.data.error}`)
            } else {
                throw new Error(`error during editWebhook: ${err}`)
            }
        }
    }

    /**
    * Appends an array of addresses to an existing webhook by its ID
    * @param {string} webhookID - the ID of the webhook to edit
    * @param {string[]} newAccountAddresses - the array of addresses to be added to the webhook
    * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
    * @throws {Error} if there is an error calling the webhooks endpoint, if the response contains an error, or if the number of addresses exceeds 10,000
    */
    async appendAddressesToWebhook(webhookID: string, newAccountAddresses: string[]): Promise<Webhook> {
        try {
            const webhook = await this.getWebhookByID(webhookID);
            const accountAddresses = webhook.accountAddresses.concat(newAccountAddresses)
            webhook.accountAddresses = accountAddresses;
            if (accountAddresses.length > 10000) {
                throw new Error(`a single webhook cannot contain more than 10,000 addresses`)
            }

            const { data } = await axios.put(`${API_URL_V0}/webhooks/${webhookID}?api-key=${this.apiKey}`, { ...webhook })
            return data;
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                throw new Error(`error during appendAddressesToWebhook: ${err.response?.data.error}`)
            } else {
                throw new Error(`error during appendAddressesToWebhook: ${err}`)
            }
        }
    }

}
