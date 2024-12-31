import { useEffect } from 'react';

export default function ProjectBlock(props) {
	useEffect(() => {
		let iframWrap = document.querySelectorAll<HTMLElement>('.video-wrapper iframe');
		iframWrap.forEach( (thing) => {
			const width = thing.getAttribute('width') || '0'; 
      		const height = thing.getAttribute('height') || '0';

      		const thingWidth = parseFloat(width);
      		const thingHeight = parseFloat(height);

			let thingRatio = 1;
	      if (Number.isFinite(thingWidth) && Number.isFinite(thingHeight)) {
	        thingRatio = thingWidth / thingHeight;
	      }

	      try {
	        thing.style.aspectRatio = String(thingRatio); // Ensure aspectRatio is a string
	      } catch (error) {
	        console.warn('Error setting aspect ratio:', error); // Handle potential errors
	      }
		});
	},[]);

	var content = '';
	var linkID = '';
	props.project.forEach((items, key) => {
		if( props.id.id == props.project[key].id ){
			content = props.project[key].proj.content
			linkID = props.id.title.replace(/[^a-zA-Z ]/g, "").replaceAll(" ", "-");
		}
	})
		return(
			<div id={linkID} className="project-block dark">	
				<div className="content" dangerouslySetInnerHTML={{ __html: content}}>
				</div>
			</div>	
		)
};
