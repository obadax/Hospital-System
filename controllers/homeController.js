const renderHome = (req,res)=>{
    res.render('home',{title: "Hospital Management System"})
}

export{ renderHome }