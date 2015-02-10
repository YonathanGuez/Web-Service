
var docjs = {};

//fonction de lancement 
docjs.start = function ()
{	//on va ecouter les clicks sur la page
	document.addEventListener("click", docjs.click);
	//on lance directement la recuperation des threads
	docjs.get_thread();
};

//Le Click  des differents boutons 
docjs.click = function (ev) 
{	//on recuper la varible cibler du click
    var src = ev.target;
	//Nouveau message
	if (src.has_class("text_inp"))
	{	
        docjs.text();
    }
	//Repondre a un message afficher
	else if(src.has_class("name_inprep"))
	{
		var e = ev ? ev : window.event;
		docjs.reply_thread2(e);
	}
	//Supprimer un message 
	else if (src.has_class("name_supp"))
	{
		docjs.delete_thread();
	}
	//Clicker sur un ID pour voir la discution
	else if (src.has_class("id"))
	{
			var e = ev ? ev : window.event;
			docjs.afficheID(e);		
	}
};

//Recuperer tout les threads
docjs.cb_getth= function () 
{
	var data=[];
    if (this.readyState == 4 && this.status == 200) 
	{	 
		data = JSON.parse(this.responseText).threads;
		docjs.show_thread(data);	
    }
};
docjs.get_thread = function ()
{
		//si c est ok on stock se nombe dans la chaine de caractere
		var req = "http://tp-iwa.waxo.org/get_threads"; 
		//on execute get()
		docjs.get(req, docjs.cb_getth);
	
};
//Affichage des threads
docjs.view=function(data,dataID)
{
	var dataThread= [];
	var data_ID=[];
	data_ID=dataID;
	dataThread=data;
	
	var div = document.getElementById("my-table");
   	var html = "";
	var text=" ";
	for (var i=0; i <dataThread.length; i++)
	{
		text +=dataThread[i]+'</br>'
	}
   div.innerHTML +='<tr><td class="nav  nav-stacked nav-pills" id="myTab" role="tablist"><li class="active" role="presentation"><a id="'+data_ID+'"class="id"  role="tab" aria-expanded="true"  data-toggle="tab" >'+ data_ID+'</a></li></td></tr>'
};
docjs.cb_showtt =function () 
{
	var data=[];
	var dataID=[];
    if (this.readyState == 4 && this.status == 200) 
	{	 
	    data = JSON.parse(this.responseText).thread;
		dataID=JSON.parse(this.responseText).id;
		docjs.view(data,dataID);
    }
};
//Fonction SHOW_THREAD
docjs.show_thread = function (data)
{  
	var threadArray=[];
	var thread= [];

	var compteur=0;
    threadArray=data;//docjs.get_thread();//je recuper tout les threads
	//je prend les 10 dernier dans variable thread
	for(var i=threadArray.length;i> threadArray.length-11;--i)
	{
		thread.push(threadArray[i]);
	}
	for(i in thread)
	{
		var req= "http://tp-iwa.waxo.org/show_thread?id="+thread[i];
		docjs.get(req, docjs.cb_showtt);
		compteur++;
	}
};

//Fonction DELETE THREAD
docjs.cb_del= function () 
{
    if (this.readyState == 4 && this.status == 200) 
	{	 
		var data = JSON.parse(this.responseText);
		
        document.getElementsByClassName("text_res")[0].innerHTML = data.id; 
		document.getElementsByClassName("name_res")[0].innerHTML = data.msg; 
		location.reload() ; 
		docjs.get_thread();
    }
};
docjs.delete_thread = function ()
{
    var id = document.getElementsByClassName("name_val1")[0].value;	
	if (id) 
	{	
		var req = "http://tp-iwa.waxo.org/delete_thread?id="+id; 
		docjs.get(req, docjs.cb_del);
	} 
	else
	{
        console.log("Verifier que l id est bon");
    }
};
//DEBUT FONCTION NEW_THREAD
docjs.cb_text= function () 
{
    if (this.readyState == 4 && this.status == 200) 
	{	
		//je caste en fichier 
		var data = JSON.parse(this.responseText);
        document.getElementsByClassName("text_res")[0].innerHTML = data.id; //this.responseText;
		location.reload() ;
		docjs.get_thread();
    }
};

//Fonction New_thread(info)
docjs.text = function ()
{
	var auteur = document.getElementsByClassName("name_autor")[0].value;
	if(auteur !="")
	{
		var msg = document.getElementsByClassName("text_val")[0].value;
		var concat="[author]"+auteur+"[/author]"+msg;
		if (concat) 
		{	
			var req = "http://tp-iwa.waxo.org/new_thread?info=" + concat; 
			docjs.get(req, docjs.cb_text);
		} 
		else
		{
			console.log("Verifier Mot de passe ou login");
		}
	}
};
//Construction de la vision d une discution 
docjs.afficheID=function(ev)
{
	var e=ev;
	docjs.MessageId(e.target.id);
}
docjs.cb_MessageId =function () 
{
	var data=[];
	var dataID=[];
    if (this.readyState == 4 && this.status == 200) 
	{	 
	    data = JSON.parse(this.responseText).thread;
		dataID=JSON.parse(this.responseText).id;
		docjs.monChatId(data,dataID);
    }
};
docjs.MessageId=function(idcliked)
{
		var id=idcliked;
		var req= "http://tp-iwa.waxo.org/show_thread?id="+id;
		docjs.get(req, docjs.cb_MessageId);
}
docjs.monChatId=function(data,dataID)
{
	var dataThread= [];
	var data_ID=[];
	data_ID=dataID;
	dataThread=data;

	var div2=document.getElementById("bodychat");

	var html = "";
	var text2=" ";
	div2.innerHTML +='</br></br><h3>Vous Regardez la conversation :'+data_ID+'</h3></br></br>'
	//affichage des conversations de la moins recente a la plus recente pour finir sur la reponce a la derniere discution
	for (var i=0; i<(dataThread.length); i++)
	{	
		if(i%2==0)
		{
			div2.innerHTML +='<div class="chat-widget-left">'+dataThread[i]+'</div>'
		}
		else
		{
			div2.innerHTML +='<hr /><div class="chat-widget-right">'+dataThread[i]+'</div>'
		}	
	}
	div2.innerHTML +='</br><input type="text" class="text_valrep form-control" placeholder="Votre Nom" /><input type="text" class="text_valrep2 form-control" placeholder="Votre Message" /><span class="input-group-btn"></br><button class="name_inprep btn-info" id="'+data_ID+'" type="button">Envoyer</button></span>'
}
//fonction  reponce d un message
docjs.cb_reply2= function () 
{
    if (this.readyState == 4 && this.status == 200) 
	{	 
		var data = JSON.parse(this.responseText);
	
        document.getElementsByClassName("text_res")[0].innerHTML = data.id; 
		document.getElementsByClassName("name_res")[0].innerHTML = data.msg; 
		location.reload();
		docjs.get_thread();
    }
};
//Fonction REPLY_TO_THREAD2 du chat a click:
docjs.reply_thread2 = function (ev)
{
	var id=Number(ev.target.id);
	//on stock les element de type facto_valdans un tableau adresse 0 et de type nombre 
    var msg = document.getElementsByClassName("text_valrep2")[0].value;
	var auteur = document.getElementsByClassName("text_valrep")[0].value;
	var concat="[author]"+auteur+"[/author]"+msg;
	if(auteur !="")
	{
		if (id && msg) 
		{	//si c est ok on stock se nombe dans la chaine de caractere
			var req = "http://tp-iwa.waxo.org/reply_to_thread?id=" + id+"&info="+concat; 
			//on execute get()
			docjs.get(req, docjs.cb_reply2);
		} 
	}
};

docjs.get = function(req, cb) 
{	
    var xhr = new XMLHttpRequest();

    xhr.open("GET", req, true);

    xhr.onreadystatechange = cb;

    xhr.send();
};

window.onload = setTimeout(docjs.start, 1);

HTMLElement.prototype.has_class = function (c) 
{
    return this.className.indexOf(c) >= 0;
};
