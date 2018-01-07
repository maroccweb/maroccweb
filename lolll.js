var firstTimePageRefereshed = 1;
    var previousState = 0;
    var userHasEntry = 0;
    var userSubmittedNumber = "";
    var hasSubmittedInDraw = 0;
    var downloadTimer = "";
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAw5AcfJFUzOblPqf-UOyzlB8tCHU9X154",
        authDomain: "skylom-firebase.firebaseapp.com",
        databaseURL: "https://skylom-firebase.firebaseio.com",
        projectId: "skylom-firebase",
        storageBucket: "skylom-firebase.appspot.com",
        messagingSenderId: "204268764865"
    };
    firebase.initializeApp(config);
    var db = firebase.database();
    db.ref('s').on('value', function (snapshot) {



        $("#campaign_id").val(snapshot.val()['c']); // campaign id
        $("#pick_type").val(snapshot.val()['ty']); // pick_type
        $("#waiting_time").val(snapshot.val()['wt']);
        $(".money").html("<sup>$</sup>"+snapshot.val()['p']); // waiting time

        $(".button-wrap").show();
        $("#submitting").hide();

        var status = snapshot.val()['s'];
        $("#campaign_status").val(status);
        if(status == 1) {
            hasSubmittedInDraw = 0;
        }
        if (phpToJsData.isLoggedIn) {
            if(firstTimePageRefereshed) {
                firstTimePageRefereshed = 0;
                checkUserEntry();
            } else {
                if(status == 1) {
                    userHasEntry = 0;
                } 
            }
        }

        if (status==1)
        {
            userSubmittedNumber = "";
            drawInProgress();
            if(phpToJsData.isLoggedIn && (previousState == 2 || previousState == 3)) {
                var timerInfoReload = Math.floor(Math.random() * 2000) + 1000;
                setTimeout(function(){
                    var valueInTmr = parseInt($('.timer-count').text());
                    if(valueInTmr == 0 || valueInTmr < 5 || isNaN(valueInTmr)) {
                        location.reload();
                    } else {
                        previousState = 0;
                    }
                }, timerInfoReload);
            }
        }
        if (status==2)
        {
            previousState = 2;
            disableGame();
        }
        if (status==3)
        {
            var winners_count = snapshot.val()['wc'];
            var winning_number = snapshot.val()['wn'];
            previousState = 3;
            showDrowWinningData(winners_count, winning_number);
        }
        if (phpToJsData.isLoggedIn) {
            if(userSubmittedNumber != "") {
                var j =0;
                for (var i = 0; i < userSubmittedNumber.length; i++) {
                    j = parseInt(i) + parseInt(1);
                    $("#t"+ j).val(userSubmittedNumber.charAt(i));
                }
            }
        }
    });
