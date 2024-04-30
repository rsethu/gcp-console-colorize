function getCurrentProjectId() {
  var queryString = window.location.search.substring(1);
  var queries = queryString.split('&');

  var projectId = null;
  queries.forEach(function (query) {
    var keyAndValue = query.split('=');
    if (keyAndValue[0] === 'project') {
      projectId = keyAndValue[1];
    }
  });

  if(projectId === null && document.URL.includes('composer.googleusercontent.com')){
    projectId = document.URL.split('-', 1)[0].replace('https://', '');
  }
  return projectId;
}

function getCurrentHeader() {
  return document.querySelector('.cfc-platform-bar-container')
    || document.querySelector('.cfc-platform-bar-white.gm2-platform-bar') 
    || document.querySelector('.navbar.navbar-fixed-top');
}

function changeHeaderColor() {
  var defaultSetting = {
    conditions: []
  };
  chrome.storage.sync.get(defaultSetting, function (setting) {
    var header = getCurrentHeader();
    if (!header) {
      console.error("can't get valid header");
      return;
    }

    var projectId = getCurrentProjectId();
    if (!projectId) {
      console.error("can't get projectId");
      return;
    }

    var conditions = setting.conditions;
    for (var i = 0; i < conditions.length; i++) {
      var condition = conditions[i];
      if (projectId.match(condition.pattern)) {
        var colorRgb = 'rgba(' + condition.color.r + ', '
          + condition.color.g + ', '
          + condition.color.b + ', '
          + condition.opacity + ')';
        header.style.backgroundColor = colorRgb;
        return;
      }
    }

    // No patterns matched, so back to original color
    header.style.backgroundColor = null;
  });
}

(function () {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    changeHeaderColor();
  });
  changeHeaderColor();
}());
