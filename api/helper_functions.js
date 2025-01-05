async function translate(entry) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0].map((item) => item[0]).join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

// Функция за рестартиране на лимита на потребителя
const checkAndResetRequestsDaily = (userRequests) => {
  const currentDate = new Date().toISOString().split("T")[0];

  if (!userRequests.resetDate) {
    userRequests.resetDate = currentDate;
  }

  if (userRequests.resetDate !== currentDate) {
    userRequests = {};
    userRequests.resetDate = currentDate;
    console.log("Request counts reset for the day.");
  }
};

module.exports = {
  translate,
  checkAndResetRequestsDaily
};
