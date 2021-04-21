const adminPage = (req, res) => {

    res.render('pages/admin/admin', {
        layout: 'adminLayout',
    })

}

const categoriesPage = (req, res) => {
    res.render('pages/admin/adminCategory', {
        layout: 'adminLayout',
    })

}

const usersPage = (req, res) => {

    res.render('pages/admin/adminUser', {
        layout: 'adminLayout',
    })
}

const blockOrUndoBlock = async (req, res, next) => {
    try {
        const user = req.idCheckedUser
        if (user.block === false) {
            user.block = true
            await user.save()
            return res.status(200).json({
                success: true,
                data: {
                    user,
                    icon: 'fas fa-lock',
                },
                message: 'Kullanıcı engellendi.',
            })
        }
        user.block = false
        await user.save()
        res.status(200).json({
            success: true,
            data: {
                user,
                icon: 'fas fa-lock-open',
            },
            message: 'Kullancının engeli kaldırıldı.',
        })

    } catch (err) {
        next(err)
    }

}

module.exports = { adminPage, categoriesPage, usersPage, blockOrUndoBlock }
