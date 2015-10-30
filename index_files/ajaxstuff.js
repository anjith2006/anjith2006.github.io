
function loadAnnounce()
{
$('#newscontp').load('commd/getannouncements.php');
}


$(document).ready(function() {
	
	var anncount = 0;
	var jcount = -1;
	var scount = 0;

	$('#tmpassgn').click(function(){
		$("#jnxt").click();
	});
	

	$.get('commd/getannouncements.php', function(data) {
		
		  $('#newscontp').html(data);
		 // alert(data);
	});
	
	
	$.get('commd/getshortp.php?count=0', function(data) {
		
		  $('#shortp').html(data);
		 // alert(data);
	});
	
	
	
	
	$("#nxt").click(function(){
		
		anncount=anncount+1;
		
		$('#newscontp').fadeOut('fast', function() {
			
			$.get('commd/getannouncements.php?count='+ anncount, function(data) {
				
				  if(data!="")
				 { 	$('#newscontp').html(data);
				  	$('#newscontp').fadeIn('fast',function(){});
				  }
				  else
				  {	anncount = -1;
				  	$("#nxt").click();
				  }
			
				 // alert(data);
			});
			// Animation complete.
		  });
		  

		
	});
	
	$("#prev").click(function(){
		
		anncount=anncount-1;
		
		if(anncount<0)
			anncount = 0;

		else
		{
			
			$('#newscontp').fadeOut('fast', function() {
			
			$.get('commd/getannouncements.php?count='+ anncount, function(data) {
				
				  $('#newscontp').html(data);
				  $('#newscontp').fadeIn('fast',function(){});
		
			});
			
		});
		
		
		}
			
		
	});
	
	
	$("#jnxt").click(function(){
		
		jcount=jcount+1;
		
		$('#tempjobtbl').fadeOut('fast', function() {
			
			$.get('commd/gettempjobs.php?count='+ jcount, function(data) {
				
				  if(data!="")
				 { 	$('#tempjobtbl').html(data);
				  	$('#tempjobtbl').fadeIn('fast',function(){});
				  }
				  else
				  {	jcount = -1;
				  	$("#jnxt").click();
				  }
			
				 // alert(data);
			});
			// Animation complete.
		  });
		  
		
	});
	
	
	
		$("#jprev").click(function(){
		
		jcount=jcount-1;
		
		if(jcount<0)
			jcount = 0;

		else
		{
			
			$('#tempjobtbl').fadeOut('fast', function() {
			
			$.get('commd/gettempjobs.php?count='+ jcount, function(data) {
				
				  $('#tempjobtbl').html(data);
				  $('#tempjobtbl').fadeIn('fast',function(){});
		
			});
			
		});
		
		
		}
			
		
	});
	
	
	$("#snxt").click(function(){
		
		scount=scount+1;
		
		  		  
		 $('#shortp').fadeOut('fast', function() {
		  	
		  	$.get('commd/getshortp.php?count='+ scount, function(data) {
		  		
		  		  if(data!="")
		  		 { 	$('#shortp').html(data);
		  		  	$('#shortp').fadeIn('fast',function(){});
		  		  }
		  		  else
		  		  {	scount = -1;
		  		  	$("#jnxt").click();
		  		  }
		  	
		  		 // alert(data);
		  	});
		  	// Animation complete.
			}); 
	
		
	});
	
	$("#sprev").click(function(){
		
		scount=scount-1;
		
		if(scount<0)
			scount = 0;
	
		else
		{
			
			$('#shortp').fadeOut('fast', function() {
			
			$.get('commd/getshortp.php?count='+ scount, function(data) {
				
				  $('#shortp').html(data);
				  $('#shortp').fadeIn('fast',function(){});
		
			});
			
		});
		
		
		}
			
		
	});

	
	


	$("#sbox").focusin(function(){
		
		
		$('#searchresults').css('display', 'block');
		
		if(!this.value)
				$('#searchresults').css('display', 'none');

		
		
		
	});

	$("#searchwrapper").focusout(function(){
		
		
	//	setTimeout(function(){$('#searchresults').css('display', 'none');} ,200)
		
		$('#searchresults').fadeOut('medium', function() {});
		
		
	});




});



function searchquery(searchq)
{
	$('#searchl').css('display', 'block');
	
//	alert(searchq);

	if(searchq)
	{
		$('#searchresults').css('display', 'block');
		
		

		
	}

	$.ajax({
		url: "/commd/searchq.php?q="+searchq,
		type: "GET",
		async: true,
		success: function(data) {
		
		$('#searchl').css('display', 'none');
		$('#searchresults').html(data);
	

		
	}});
	
}

