export default function siteInfo(props) {

            return(
                  <div id="info" className="page-info" dangerouslySetInnerHTML={{ __html: props.pageInfo.page.content}} >
                  </div>     
            )
};


