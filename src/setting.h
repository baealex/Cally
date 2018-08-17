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
    void on_pushButton_3_clicked();
    void on_pushButton_clicked();
    void on_AutoStartCheck_stateChanged(int arg1);
    void on_horizontalSlider_valueChanged(int value);

private:
    Ui::Setting *ui;
    MainForm &Mainref;
    QString m_fileName;
    QPixmap m_img;
};

#endif // SETTING_H
