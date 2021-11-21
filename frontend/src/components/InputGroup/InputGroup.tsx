import React from 'react';

import './InputGroup.scss';

export const InputGroup: React.FC = ({ children }) => (
	<div className="input-group">
		{children}
	</div>
);
