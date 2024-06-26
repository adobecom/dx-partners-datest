const removeJoinNowCta = () => {
  console.log('Remove join now cta');
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const partnerDataCookie = cookies.find(cookie => cookie.startsWith('partner_data='));
  if (!partnerDataCookie) return;
  const cookieValue = JSON.parse(decodeURIComponent(partnerDataCookie.substring(('partner_data=').length).toLowerCase()));
  if (!cookieValue || !cookieValue.status || cookieValue.status === 'member') return;
  const joinNowCta = document.querySelector('.marquee .con-button');
  joinNowCta.remove();
}

removeJoinNowCta();
