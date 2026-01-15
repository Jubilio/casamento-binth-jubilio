// Utility functions for guest list management

/**
 * Normalize string for comparison (remove accents, lowercase, trim)
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Get all guests from a list of groups
 * Handles both camelCase (JSON) and snake_case (Supabase)
 */
export const getAllGuestsFromGroups = (groups) => {
  if (!groups || !Array.isArray(groups)) return [];
  
  const allGuests = [];
  
  groups.forEach((group) => {
    const guestsList = group.guests || [];
    const groupName = group.name;
    const groupId = group.id;
    const maxGuests = group.max_guests || group.maxGuests || 10;

    guestsList.forEach((guestName) => {
      if (guestName && guestName.trim()) {
        allGuests.push({
          name: guestName,
          normalizedName: normalizeString(guestName),
          group: groupName,
          groupId: groupId,
          maxGuests: maxGuests,
        });
      }
    });
  });
  
  return allGuests;
};

/**
 * Search for a guest by name (fuzzy search) in a list of groups
 */
export const searchGuestInGroups = (searchTerm, groups) => {
  if (!searchTerm || searchTerm.trim().length < 3) {
    return [];
  }
  
  const normalized = normalizeString(searchTerm);
  const allGuests = getAllGuestsFromGroups(groups);
  
  return allGuests.filter((guest) =>
    guest.normalizedName.includes(normalized)
  );
};

/**
 * Validate if a guest exists in a list of groups
 */
export const validateGuestInGroups = (guestName, groups) => {
  const normalized = normalizeString(guestName);
  const allGuests = getAllGuestsFromGroups(groups);
  
  return allGuests.find((guest) => guest.normalizedName === normalized);
};

/**
 * Get guest statistics from groups
 */
export const getGuestStatsFromGroups = (groups) => {
  if (!groups || groups.length === 0) {
    return {
      totalGroups: 0,
      totalGuests: 0,
      totalCapacity: 0,
      averagePerGroup: 0
    };
  }

  const allGuests = getAllGuestsFromGroups(groups);
  const totalGroups = groups.length;
  const totalGuests = allGuests.length;
  const totalCapacity = groups.reduce((sum, group) => sum + (group.max_guests || group.maxGuests || 10), 0);
  
  return {
    totalGroups,
    totalGuests,
    totalCapacity,
    averagePerGroup: (totalGuests / totalGroups).toFixed(1),
  };
};

/**
 * Parse guest name to check for companion allowance
 * Returns { principalName, companionAllowed }
 */
export const parseCompanionName = (fullName) => {
  if (!fullName) return { principalName: '', companionAllowed: false };

  const suffixes = [
    ' e acompanhante',
    ' e acompanhantes',
    ' e esposa',
    ' e esposo',
    ' e mulher',
    ' e marido',
    ' +1',
    ' +2'
  ];

  const lowerName = fullName.toLowerCase();
  const matchedSuffix = suffixes.find(suffix => lowerName.endsWith(suffix));

  if (matchedSuffix) {
    const suffixIndex = lowerName.lastIndexOf(matchedSuffix);
    const principalName = fullName.substring(0, suffixIndex).trim();
    
    return {
      principalName,
      companionAllowed: true
    };
  }

  return {
    principalName: fullName,
    companionAllowed: false
  };
};

export default {
  normalizeString,
  getAllGuestsFromGroups,
  searchGuestInGroups,
  validateGuestInGroups,
  getGuestStatsFromGroups,
  parseCompanionName,
};
