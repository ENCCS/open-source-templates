(function(undefined) {
  var choices = {};

  var content = {};

  var proMode = false;

  var viewCover = function() {
    $('body').scrollTop(0);
    $('.page').hide();
    $('.cover').show();
  }
  var viewPage = function(pageNumber) {
    $('body').scrollTop(0);
    $('.cover').hide();
    $('.page').hide();
    $('#page-'+pageNumber).show();
  };

  var makeChoice = function(pageNumber, choiceKey, choiceValue) {
    if (pageNumber === 1) {
      choices = {};
    }

    choices[choiceKey] = choiceValue;

    fetchContent(choiceKey, choiceValue);

    return viewPage(pageNumber);
  };

  var addToChecklist = function(pageNumber, choiceValue) {
    choices['checklist'] = choices['checklist'] || {};

    choices['checklist'][choiceValue] = choiceValue;

    fetchContent('checklist', choiceValue);

    return viewPage(pageNumber);
  };

  var fetchContent = function(choiceKey, choiceValue, type) {
    type = type || choices['type'];
    if (['language', 'framework'].indexOf(choiceKey) !== -1) {
      var contentKey = type+'-'+choiceKey+'-'+choiceValue;
      if (content[contentKey] === undefined) {
        $.get( "templates/"+type+"/"+choiceKey+"/"+choiceValue+".html", function(text) {
          content[contentKey] = text;
          updateTextarea();
        });
      } else {
        updateTextarea();
      }
    }
  };

  var updateTextarea = function() {
    var text = '';
    if (choices['type'] === 'gpu-yes') {
      text = "Your code already runs on GPUs and " + content['gpu-yes-language-'+choices['language']]+"\n"+
              content['gpu-yes-framework-'+choices['framework']];
    } else if (choices['type'] === 'gpu-no') {
      text  = "Your code does not run on GPUs, yet, and " + content['gpu-no-language-'+choices['language']]+"\n"+
              content['gpu-no-framework-'+choices['framework']];
    }
    text += '\n<b>Remember!</b> Profiling and tuning are <em>essential</em> to obtain good performance!';
    document.getElementById('summary').innerHTML = text;
  };

  var routes = {
    '/': viewCover,
    '/page/:pageNumber': viewPage,
    '/page/:pageNumber/checklist/:choiceValue': addToChecklist,
    '/page/:pageNumber/:choiceKey/:choiceValue': makeChoice
  };

  var router = Router(routes);

  router.setRoute('/')

  router.init();

  // needed?
  fetchContent('change-types', 'gpu-yes', 'gpu-no');
  fetchContent('checklist', 'intro', 'gpu-no');

  $('#boss-key').click(function() {
    var selector = 'p, h1, h2, img, div.author, div.page-number';
    proMode = !proMode;
    if (proMode) {
      $(selector).animate({opacity: 0.07});
    } else {
      $(selector).animate({opacity: 1});
    }
    return false;
  });

})()
