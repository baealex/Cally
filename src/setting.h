#ifndef SETTING_H
#define SETTING_H

#include <QDialog>
#include "mainform.h"
#include "function.h"

namespace Ui {
class Setting;
}

class Setting : public QDialog
{
    Q_OBJECT

public:
    explicit Setting(MainForm &ref,QWidget *parent = 0);
    ~Setting();

private slots:
    void on_AutoStartCheck_stateChanged(int arg1);

    void on_picture_btn_clicked();

    void on_homepage_btn_clicked();

    void on_opacity_bar_valueChanged(int value);

    void on_pushButton_clicked();

private:
    Ui::Setting *ui;
    MainForm &Mainref;
    QString m_fileName;
    bool AutoStart = false;
    bool isMouseDown;

protected:
   void mousePressEvent(QMouseEvent * event);
   void mouseReleaseEvent(QMouseEvent * event);
   void mouseMoveEvent(QMouseEvent * event);
   int m_nMouseClick_X_Coordinate;
   int m_nMouseClick_Y_Coordinate;
};

#endif // SETTING_H
