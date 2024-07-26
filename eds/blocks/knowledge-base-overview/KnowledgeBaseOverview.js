import PartnerCardsWithDateFilter from '../../components/PartnerCardsWithDateFilter.js';

export default class KnowledgeBaseOverview extends PartnerCardsWithDateFilter {
  constructor() {
    super();
    this.useStageCaasEndpoint = true;
  }
}
