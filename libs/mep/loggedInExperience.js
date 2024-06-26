// todo move this to util
const getProgramType = (path) => {
  switch(true) {
    case /solutionpartners/.test(path): return 'spp';
    case /technologypartners/.test(path): return 'tpp';
    case /channelpartners/.test(path): return 'cpp';
    default: return '';
  }
}

const removeJoinNowCta = () => {
  console.log('Remove join now cta');
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const partnerDataCookie = cookies.find(cookie => cookie.startsWith('partner_data='));
  if (!partnerDataCookie) return;
  const cookieValue = JSON.parse(decodeURIComponent(partnerDataCookie.substring(('partner_data=').length).toLowerCase()));
  if (!cookieValue || !cookieValue[getProgramType(window.location.pathname)]) return;
  const status = cookieValue[getProgramType(window.location.pathname)].status;
  if (status !== 'member') return;
  const joinNowCta = document.querySelector('.marquee .con-button');
  joinNowCta.remove();
}

removeJoinNowCta();
