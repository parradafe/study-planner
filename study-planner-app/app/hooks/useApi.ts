import { DomainItem } from "../interfaces/domainItem.interface";

export function useApi() {
  async function getDomains() {
    const data = await fetch("http://localhost:3001/api/domains");
    return data.json();
  }

  async function addDomain(domainData: DomainItem) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(domainData),
    };

    const data = await fetch(
      "http://localhost:3001/api/domains",
      requestOptions
    );
    return data.json();
  }

  async function updateDomainById(domainData: DomainItem) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(domainData),
    };

    const data = await fetch(
      "http://localhost:3001/api/domains",
      requestOptions
    );
    return data.json();
  }

  async function getTopicsByDomainId() {
    const data = await fetch("http://localhost:3001/api/domains");
    return data.json();
  }

  async function addTopic(topicData: DomainItem) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topicData),
    };

    const data = await fetch(
      "http://localhost:3001/api/domains",
      requestOptions
    );
    return data.json();
  }

  async function updateTopicById(topicData: DomainItem) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topicData),
    };

    const data = await fetch(
      "http://localhost:3001/api/domains",
      requestOptions
    );
    return data.json();
  }

  return {
    getDomains,
    addDomain,
    updateDomainById,
    getTopicsByDomainId,
    addTopic,
    updateTopicById,
  };
}
