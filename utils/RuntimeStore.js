// src/lib/runtimeStore.js

/**
 * @typedef {Object} AvailabilityEntry
 * @property {string} resourceId - Identifier for the resource
 * @property {Date} availableAt - Timestamp when the resource became available
 * @property {string} status - Current status of the resource
 */

/**
 * @typedef {Object} StatisticEntry
 * @property {string} metric - Name of the metric
 * @property {number} value - Recorded value of the metric
 * @property {Date} recordedAt - Timestamp when the metric was recorded
 */

/**
 * @typedef {Object} StoreAvailabilityEntry
 * @property {AvailabilityEntry} entry - Original availability entry
 * @property {Date} addedAt - Timestamp when the entry was added to the store
 */

/**
 * @typedef {Object} StoreStatisticEntry
 * @property {StatisticEntry} entry - Original statistic entry
 * @property {Date} addedAt - Timestamp when the entry was added to the store
 */

class RuntimeStore {
    constructor() {
        /** @type {{ [service: string]: StoreAvailabilityEntry[] }} */
        this.availabilityLists = {};
        /** @type {StoreStatisticEntry[]} */
        this.statisticsList = [];
    }

    /**
     * Add a new availability entry to the list for a given service
     * @param {string} service - Identifier for the service
     * @param {AvailabilityEntry} entry - Availability entry to add
     */
    addAvailability(service, entry) {
        if (!this.availabilityLists[service]) {
            this.availabilityLists[service] = [];
        }
        this.availabilityLists[service].push({ entry, addedAt: new Date() });
    }

    /**
     * Get all availability entries for a given service
     * @param {string} service - Identifier for the service
     * @returns {StoreAvailabilityEntry[]}
     */
    getAvailability(service) {
        return this.availabilityLists[service] || [];
    }

    /**
     * Clear all availability entries for a given service
     * @param {string} service - Identifier for the service
     */
    clearAvailability(service) {
        this.availabilityLists[service] = [];
    }

    /**
     * Clear all availability entries for all services
     */
    clearAllAvailability() {
        this.availabilityLists = {};
    }

    /**
     * Get all availability entries grouped by service
     * @returns {{ [service: string]: StoreAvailabilityEntry[] }}
     */
    getAllAvailabilities() {
        return this.availabilityLists;
    }

    /**
     * Add a new statistic entry to the list
     * @param {StatisticEntry} entry
     */
    addStatistic(entry) {
        this.statisticsList.push({ entry, addedAt: new Date() });
    }

    /**
     * Get all statistic entries
     * @returns {StoreStatisticEntry[]}
     */
    getStatistics() {
        return this.statisticsList;
    }

    /**
     * Clear all statistic entries
     */
    clearStatistics() {
        this.statisticsList = [];
    }
}

// Export a single shared instance for runtime-wide persistence
export const runtimeStore = new RuntimeStore();
