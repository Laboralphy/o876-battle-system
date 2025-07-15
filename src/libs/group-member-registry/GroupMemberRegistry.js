/**
 * @class GroupMemberRegistry
 * @classDesc Registry to manage groups of members. This class manages one-to-many entities.
 */
class GroupMemberRegistry {
    /**
     * Initializes a new instance of the GroupRegistry.
     */
    constructor () {
        this._groups = new Map();
        this._members = new Map();
    }

    /**
     * Retrieves the group ID of a specified member.
     * @param {string} idMember - The ID of the member.
     * @returns {string|undefined} The group ID of the member, or undefined if the member is not found.
     */
    getMemberGroup (idMember) {
        return this._members.get(idMember);
    }

    /**
     * Sets the group of a specified member.
     * @param {string} idMember - The ID of the member.
     * @param {string} idGroup - The ID of the group to set for the member.
     */
    setMemberGroup (idMember, idGroup) {
        const idPrevGroup = this.getMemberGroup(idMember);
        if (idPrevGroup) {
            this.getGroupRegistry(idPrevGroup).delete(idMember);
        }
        this.getGroupRegistry(idGroup).add(idMember);
        this._members.set(idMember, idGroup);
    }

    /**
     * Retrieves all members located at a specified group.
     * @param {string} idGroup - The ID of the group.
     * @returns {Array<string>} An array of member IDs located at the specified group.
     */
    getGroupMembers (idGroup) {
        if (this._groups.has(idGroup)) {
            return [...this._groups.get(idGroup)];
        } else {
            return [];
        }
    }

    /**
     * Retrieves the registry of members for a specified group.
     * If the group does not exist, it initializes it.
     * @param {string} idGroup - The ID of the group.
     * @returns {Set<string>} The set of member IDs located at the specified group.
     */
    getGroupRegistry (idGroup) {
        if (!this._groups.has(idGroup)) {
            this._groups.set(idGroup, new Set());
        }
        return this._groups.get(idGroup);
    }

    /**
     * Removes an member from the registry.
     * @param {string} idMember - The ID of the member to remove.
     */
    removeMember (idMember) {
        const idMemberGroup = this.getMemberGroup(idMember);
        if (idMemberGroup) {
            this._members.delete(idMember);
            this._groups.get(idMemberGroup).delete(idMember);
        }
    }

    /**
     * Removes a group, removes all members of this group.
     * @param idGroup {string}
     */
    removeGroup (idGroup) {
        for (const idMember of  this.getGroupMembers(idGroup)) {
            this.removeMember(idMember);
        }
        this._groups.delete(idGroup);
    }
}

module.exports = GroupMemberRegistry;
