function addCondition(condition) {
  var $table = $('#conditions');
  var $condition = $('<tr class="condition">');
  var $pattern = $('<td><input type="text" placeholder="pattern" class="pattern"></input></td>');
  var $color = $('<td><input type="color" class="color" ></input></td>');
  var $opacity = $('<td><input type="number" style="width: 3em" class="opacity" min="0" step=".1" value="0.3" max="1"></input></td>');
  var $remove = $('<td><a href="#" id="remove" class="link-danger" title="remove">X</a></td>');

  $condition.append($pattern);
  $condition.append($color);
  $condition.append($opacity);
  $condition.append($remove);

  if (condition) {
    $pattern.find('.pattern')[0].value = condition.pattern;
    $opacity.find('.opacity')[0].value = condition.opacity;

    const hexR = condition.color.r.toString(16).padStart(2, '0');
    const hexG = condition.color.g.toString(16).padStart(2, '0');
    const hexB = condition.color.b.toString(16).padStart(2, '0');

    $color.find('.color')[0].value = `#${hexR}${hexG}${hexB}`;
  }
  $table.append($condition);

  // set event handler
  $remove.click(function(event) {
    $condition.remove();
  });
}

function addEmptyCondition() {
  addCondition(undefined);
}

function saveConditions() {
  var conditions = [];
  $('.condition').each(function(i, elem) {
    var pattern = $(elem).find('.pattern')[0].value;
    var opacity = $(elem).find('.opacity')[0].value;
    var color = $(elem).find('.color')[0].value;

    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);

    conditions.push({
      pattern: pattern,
      opacity: opacity,
      color: {
        r: r,
        g: g,
        b: b,
      },
    });
  });

  var setting = {
    conditions: conditions
  };
  console.log("save setting: ", setting);

  chrome.storage.sync.set(setting, function() {
    console.log('saved!');
    var $container = $('#container');
    var $message = $('<span id="alert">saved!</span>');
    $container.append($message);
    setTimeout(function() {
      $message.remove();
    }, 1000);
  });
}

(function() {
  // initialize
  $('#save').click(function(event) {
    saveConditions();
  });
  $('#add').click(function(event) {
    addEmptyCondition();
  });

  var defaultSetting = {
    conditions: []
  };

  chrome.storage.sync.get(defaultSetting, function(setting) {
    console.log("get setting: ", setting);
    var conditions = setting.conditions;
    if (conditions.length === 0) {
      addEmptyCondition();
      return;
    }

    conditions.forEach(function(condition) {
      addCondition(condition);
    });
  });
}());
