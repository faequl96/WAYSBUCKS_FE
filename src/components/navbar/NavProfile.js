import { Dropdown, Image, Badge, Nav } from 'react-bootstrap';

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import cartIcon from '../../assets/cartIcon.png';
import profileImage from '../../assets/profileImage.png';
import profileIcon from '../../assets/profile.png';
import logoutIcon from '../../assets/logout.png';
import drinkIcon from '../../assets/drink.png';
import topingIcon from '../../assets/toping.png';
import { UserContext } from '../../contexts/UserContext';
import { AppContext } from '../../contexts/AppContext';


const NavProfile = ({ cartLength }) => {
	const navigate = useNavigate();
	const [state, dispatch] = useContext(UserContext);
	const contexts = useContext(AppContext);

	const handlerLogout = () => {
		dispatch({
			type: "LOGOUT",
		});
		contexts.setIsLogin(false)
		navigate("/");
	};

	return (
		<>
			<Nav className='ms-auto'>
				<div className='d-flex align-items-center gap-3' style={{ cursor: 'pointer' }}>
					{state.user.role === 'customer' && (
						<>
							<Image src={cartIcon} width='40px' height='40px' onClick={() => navigate('/mycart')}/>
							{cartLength > 0 && (
								<Badge bg='danger' pill style={{ height: '25px', width: '25px' }} className='d-flex align-items-center justify-content-center fs-6 position-absolute ms-4'>
									{cartLength}
								</Badge>
							)}
						</>
					)}

					<Dropdown>
						<Dropdown.Toggle variant='' id='dropdown-basic'>
							<Image src={profileImage} width='45px' height='45px' className='rounded-pill'/>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item className=' align-items-center border-bottom' style={{ height: '50px' }} >
								<Link
									to={state.user.role === 'customer' ? '/customer/myprofile' : '/admin/transaction'}
									className='text-dark text-decoration-none d-flex gap-2'
								>
									{state.user.role === 'customer' ? (
										<>
											<Image src={profileIcon} width='25px' />
											<span>Profile</span>
										</>
									) : (
										<>
											<Image src={profileIcon} width='25px' />
											<span>Transaction</span>
										</>
									)}
								</Link>
							</Dropdown.Item>
								{state.user.role === 'admin' && (
									<>
										<Dropdown.Item className='d-flex gap-2 align-items-center border-bottom' style={{ height: '50px' }}>
											<Link to='/' className='text-dark text-decoration-none d-flex gap-2'>
												<Image src={drinkIcon} width='25px' />
												Add Product
											</Link>
										</Dropdown.Item>
										<Dropdown.Item className='d-flex gap-2 align-items-center border-bottom' style={{ height: '50px' }}>
											<Link to='/' className='text-dark text-decoration-none d-flex gap-2'>
												<Image src={topingIcon} width='25px' />
												Add Toping
											</Link>
										</Dropdown.Item>
									</>
								)}
							<Dropdown.Item
								className='d-flex gap-2 align-items-center'
								style={{ height: '50px' }}
								onClick={handlerLogout}
							>
								<Image src={logoutIcon} width='25px' />
								Logout
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</Nav>
		</>
	);
};

export default NavProfile;