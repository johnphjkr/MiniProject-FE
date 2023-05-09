import { useEffect, useState } from 'react';
import * as S from './styles';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    status: boolean;
    profile: string;
    date: string;
    annual_limit: number;
    annual_count: number;
    isEditing: boolean;
}


function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [pages, setPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    useEffect(() => {
        fetch('/src/mockup/user_all1.json')
            .then(res => res.json())
            .then(data => {
                setUsers(data.data);
                setPages(data.pageAll);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleAdminClick = (userId: number) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                ...user,
                isEditing: true
                };
            } else {
                return user;
            }
        });
        setUsers(updatedUsers);
    };

    const handleSaveClick = (userId: number) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    isEditing: false
                };
            } else {
                return user;
            }
        });
        setUsers(updatedUsers);
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>, userId: number) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    role: event.target.value
                };
            } else {
                return user;
            }
        });
        setUsers(updatedUsers);
    };

    const handleMinusClick = (userId: number) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                ...user,
                annual_count: Math.max(user.annual_count - 1, 0)
                };
            } else {
                return user;
            }
        });
        setUsers(updatedUsers);
    };

    const handlePlusClick = (userId: number) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                ...user,
                annual_count: Math.min(user.annual_count + 1, user.annual_limit)
                };
            } else {
                return user;
            }
        });
        setUsers(updatedUsers);
    };

    const handlePageClick = (page: number) => {
        if (page < 1) {
            page = 1;
        }
        if (page > pages) {
            page = pages;
        }
        setCurrentPage(page);
        fetch(`/src/mockup/user_all${page}.json`)
            .then(res => res.json())
            .then(data => setUsers(data.data))
            .catch(error => console.error('Error:', error));
    };

    const pageButtons = [];
    for (let i = 1; i <= pages; i++) {
        pageButtons.push(
            <S.PageBtn key={i} onClick={() => handlePageClick(i)}>{i}</S.PageBtn>
        );
    }
              

  return (
    <S.Wrapper>
          <S.IndexDiv>
              <S.NameBox>사원명</S.NameBox>
              <S.RoleBox>직급</S.RoleBox>
              <S.DateBox>입사 날짜</S.DateBox>
              <S.AnnualBox>잔여 연차</S.AnnualBox>
          </S.IndexDiv>
          {users.map((user) => (
              <S.UserDiv key={user.id}>
                  <S.ProfileImg src="././public/assets/profile.png"/>
                  <S.NameBox>{user.username}</S.NameBox>
                  {user.isEditing ? (<S.DeleteBtn>삭제</S.DeleteBtn>):null}
                  <S.RoleBox>
                      {user.isEditing ? (
                        <S.RoleSelect value={user.role} onChange={(event) => handleRoleChange(event, user.id)}>
                            <option value="USER">사원</option>
                            <option value="ADMIN">관리자</option>
                            <option value="MASTER">마스터</option>
                        </S.RoleSelect>
                        ) : (
                        user.role === 'USER'
                            ? '사원'
                            : user.role === 'ADMIN'
                            ? '관리자'
                            : '마스터'
                    )}
                  </S.RoleBox>
                  <S.DateBox>{user.date}</S.DateBox>
                  <S.AnnualBox>
                      {user.isEditing ? (
                        <>
                            <button onClick={() => handleMinusClick(user.id)}>-</button>
                            {user.annual_limit - user.annual_count}개
                            <button onClick={() => handlePlusClick(user.id)}>+</button>
                        </>
                        ) : (
                        `${user.annual_limit - user.annual_count}개`
                        )}
                  </S.AnnualBox>
                  <S.AdminBtn onClick={()=> user.isEditing ? handleSaveClick(user.id) : handleAdminClick(user.id)}>{user.isEditing ? '저장' : '관리'}</S.AdminBtn>
              </S.UserDiv>))}
                <S.PageBtnBox>
                    <S.PageBtn onClick={()=> handlePageClick(currentPage-1)}>&lt;</S.PageBtn>
                    {pageButtons}
                    <S.PageBtn onClick={()=> handlePageClick(currentPage+1)}>&gt;</S.PageBtn>
                </S.PageBtnBox>
    </S.Wrapper>
  );
}

export default Admin;