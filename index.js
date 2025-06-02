document.addEventListener("DOMContentLoaded",function()
{

    let search=document.getElementById('search');
    let userInput=document.getElementById('userInput');
    let easyLabel=document.getElementById('easy-label');
    let medLabel=document.getElementById('med-label');
    let hardLabel=document.getElementById('hard-label');
    let easyCircle=document.querySelectorAll('.pie')[0];
    let medCircle=document.querySelectorAll('.pie')[1];
    let hardCircle=document.querySelectorAll('.pie')[2];
    let statsContainer=document.querySelector('.stats-container');
    const statsCardsContainer=document.querySelector('.cards-container');
    const pie=document.querySelector('.pie');
    
    function isvalid(username)
    {
        //remove whitespaces and validate with regex
        if(username.trim()==="")
            {
                alert("No username entered.");
                return false;
            }

        const reg=/^(?!.*[-_]{2})(?![-_])[a-zA-Z0-9-_]{1,20}(?<![-_])$/;
        if(reg.test(username))
        {
            return true;
        }
        else
        {
            alert("Invalid Username");
            return false;
        }


    }
// If you appply 3 function calls on pie it will not work , seperately select the element 
    function updatePie(circle,label,solved,total)
    {
        let percent=(solved/total)*100;
        circle.style.setProperty('--progress',percent);
        
        label.textContent=`${solved}/${total}`;
    }
    function addCard(heading,data)
    {
        let el=document.createElement('div');
        el.setAttribute('class','card');
        let head=document.createElement('h4');
        head.textContent=`${heading}`;
        el.appendChild(head);
        let para=document.createElement('p');
        para.textContent=`${data}`;
        el.appendChild(para);
        statsCardsContainer.append(el);
    }
    function showData(data)
    {
        let easySolved=data['easySolved'];
        let medSolved=data['mediumSolved'];
        let hardSolved=data['hardSolved'];
        let totalEasy=data['totalEasy'];
        let totalHard=data['totalHard'];
        let totalMed=data['totalMedium'];
        updatePie(easyCircle, easyLabel , easySolved,totalEasy);
        updatePie(medCircle, medLabel , medSolved,totalMed);
        updatePie(hardCircle, hardLabel , hardSolved,totalHard);
        addCard("Ranking",data.ranking);
        addCard("Acceptance Rate",data.acceptanceRate);
        addCard("Total Solved",`${data.totalSolved}/${data.totalQuestions}`)
    }
    
    async function fetchUserData(username)
    {
        //string ke andr access ke liye $
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            search.textContent="Fetching...";
            search.disabled=true;
            let statusMessage = document.getElementById('status-message');
            statusMessage.textContent = `Fetching data for "${username}"...`;

            const response=await fetch(url);
            search.textContent="Go";
            search.disabled=false;
            if(!response.ok)
            {
               throw new Error("api not fetched"); 
            }
            const data=await response.json();
            
            if(data.status==='error')
            {
                statusMessage.textContent='';
                alert("User Not Found");
                return;
            }          
            statusMessage.textContent = `Showing data for "${username}"...`;
            console.log(data);
            showData(data);
            
        }
        catch(e)
        {
            
            statsContainer.textContent=`${e}`;
        }
                
    }
    
    

    async function searchButtonClicked(event)
    {
        statsCardsContainer.innerHTML = '';
        easyLabel.textContent='';
        medLabel.textContent='';
        hardLabel.textContent='';
        
        easyCircle.style.setProperty('--progress', 0);
        medCircle.style.setProperty('--progress', 0);
        hardCircle.style.setProperty('--progress', 0);

        const username=userInput.value;
        userInput.value="";
        if(isvalid(username))
        {

            await fetchUserData(username);
            
        }

    }

    search.addEventListener('click',searchButtonClicked);
})
